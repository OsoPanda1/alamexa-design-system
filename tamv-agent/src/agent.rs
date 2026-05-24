//! Top-level agent event loop: tokio-driven, non-blocking. Runs:
//!   * Gossip tick      (every gossip_interval_ms)
//!   * Inbox dispatch   (always)
//!   * Chain initiator  (only if `--initiator` or node id == 1)

use crate::config::Config;
use crate::gossip;
use crate::hmac::Signer;
use crate::message::{Body, Envelope};
use crate::state::{now_ms, NodeRecord, State, StateStore, Status};
use crate::{chain, transport::Transport};
use anyhow::Result;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;
use tracing::{info, warn};

const MAX_SKEW_MS: u64 = 30_000;
const DIGEST_MAX_ENTRIES: usize = 64;

pub struct Agent {
    cfg: Config,
    signer: Arc<Signer>,
    store: Arc<StateStore>,
    transport: Transport,
    initiator: bool,
}

impl Agent {
    pub async fn new(cfg: Config, state_path: PathBuf, initiator: bool) -> Result<Self> {
        let signer = Arc::new(Signer::from_b64(&cfg.mesh.secret_key)?);
        let store = Arc::new(StateStore::open(state_path, cfg.node.id)?);
        let transport = Transport::bind(&cfg.mesh.interface, &cfg.mesh.peers).await?;
        let initiator = initiator || cfg.node.id == 1;
        Ok(Self { cfg, signer, store, transport, initiator })
    }

    pub async fn run(mut self) -> Result<()> {
        // Announce ourselves immediately.
        self.send_all(Body::Hello { from_id: self.cfg.node.id }).await?;

        let mut gossip_tick =
            tokio::time::interval(Duration::from_millis(self.cfg.mesh.gossip_interval_ms));
        let mut chain_tick =
            tokio::time::interval(Duration::from_millis(self.cfg.agent.chain_timeout_ms));

        loop {
            tokio::select! {
                _ = gossip_tick.tick() => self.do_gossip().await?,
                _ = chain_tick.tick(), if self.initiator => self.start_round().await?,
                Some((bytes, _src)) = self.transport.inbox.recv() => {
                    if let Err(e) = self.handle_inbound(&bytes).await {
                        warn!(?e, "inbound message rejected");
                    }
                }
            }
        }
    }

    async fn do_gossip(&self) -> Result<()> {
        let snapshot = self.store.read().await;
        let body = gossip::build_digest(&snapshot, DIGEST_MAX_ENTRIES);
        self.send_all(body).await
    }

    async fn start_round(&self) -> Result<()> {
        let round_id = now_ms();
        self.store.mutate(|s| s.current_round = round_id).await?;
        let body = chain::next_step(&self.cfg, round_id, vec![self.cfg.node.id]);
        info!(round_id, "initiating chain round");
        self.send_all(body).await
    }

    async fn handle_inbound(&self, bytes: &[u8]) -> Result<()> {
        let env: Envelope = serde_json::from_slice(bytes)?;
        env.verify(&self.signer, MAX_SKEW_MS)?;
        match env.body {
            Body::Hello { from_id } => self.mark_seen(from_id).await?,
            Body::StateSync { from_id, partial_state, .. } => {
                self.mark_seen(from_id).await?;
                self.store.mutate(|s| gossip::merge(s, partial_state)).await?;
            }
            Body::ChainStep { from_id, chain_start, current: _, next, round_id, mut path } => {
                self.mark_seen(from_id).await?;
                if next != self.cfg.node.id { return Ok(()); }
                path.push(self.cfg.node.id);
                self.store
                    .mutate(|s| {
                        let rec = s.registry.entry(self.cfg.node.id).or_default();
                        rec.chain_seen = Some(round_id);
                    })
                    .await?;
                // Cycle closed?
                let new_next = self.cfg.node.next_id;
                if new_next == chain_start {
                    let report = chain::close_report(&self.cfg, round_id, path, vec![]);
                    return self.send_all(report).await;
                }
                let step = chain::next_step(&self.cfg, round_id, path);
                self.send_all(step).await?;
            }
            Body::ChainReport { round_id, complete_cycle, breaks, .. } => {
                info!(round_id, complete_cycle, ?breaks, "chain round report");
            }
        }
        Ok(())
    }

    async fn mark_seen(&self, id: u16) -> Result<()> {
        let ts = now_ms();
        self.store
            .mutate(|s| {
                let rec = s.registry.entry(id).or_insert_with(NodeRecord::default);
                rec.status = Some(Status::Up);
                rec.last_seen = Some(ts);
            })
            .await
    }

    async fn send_all(&self, body: Body) -> Result<()> {
        let env = Envelope::new(body, &self.signer)?;
        let bytes = serde_json::to_vec(&env)?;
        self.transport.broadcast(&bytes).await
    }
}