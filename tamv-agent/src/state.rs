//! Persistent agent state. Atomic write via tmp+rename to survive power cuts.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::RwLock;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Status { Up, Down, Unknown }

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct NodeRecord {
    pub status: Option<Status>,
    pub last_seen: Option<u64>,
    pub chain_seen: Option<u64>,
    pub break_meta: Option<BreakMeta>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BreakMeta {
    pub reported_by: u16,
    pub at: u64,
    pub skipped_to: Option<u16>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub local_id: u16,
    #[serde(default)]
    pub registry: HashMap<u16, NodeRecord>,
    pub current_round: u64,
}

impl State {
    pub fn bootstrap(local_id: u16) -> Self {
        Self { local_id, registry: HashMap::new(), current_round: 0 }
    }
}

pub struct StateStore {
    path: PathBuf,
    inner: RwLock<State>,
}

impl StateStore {
    pub fn open(path: PathBuf, local_id: u16) -> Result<Self> {
        let state = if path.exists() {
            let raw = std::fs::read_to_string(&path)
                .with_context(|| format!("reading state {}", path.display()))?;
            serde_json::from_str(&raw).context("parsing state.json")?
        } else {
            State::bootstrap(local_id)
        };
        Ok(Self { path, inner: RwLock::new(state) })
    }

    pub async fn read(&self) -> State { self.inner.read().await.clone() }

    pub async fn mutate<F>(&self, f: F) -> Result<()>
    where F: FnOnce(&mut State) {
        let mut guard = self.inner.write().await;
        f(&mut guard);
        Self::persist_atomic(&self.path, &guard)
    }

    fn persist_atomic(path: &Path, state: &State) -> Result<()> {
        let tmp = path.with_extension("json.tmp");
        let body = serde_json::to_vec_pretty(state)?;
        std::fs::write(&tmp, body)?;
        std::fs::rename(&tmp, path)?;
        Ok(())
    }
}

pub fn now_ms() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0)
}