//! Per-node configuration loaded from `config.toml`. The ONLY file that
//! differs across the 206 TAMV repos.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Config {
    pub node: NodeCfg,
    pub mesh: MeshCfg,
    pub agent: AgentCfg,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct NodeCfg {
    /// Integer 1..=206
    pub id: u16,
    /// Successor in the ring (typically (id % 206) + 1)
    pub next_id: u16,
    /// Predecessor in the ring (typically ((id + 204) % 206) + 1)
    pub prev_id: u16,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MeshCfg {
    /// "wlan0", "hci0" (BLE), "udp:0.0.0.0:9876", etc.
    pub interface: String,
    pub gossip_interval_ms: u64,
    /// HMAC shared secret (base64). Distributed out-of-band.
    pub secret_key: String,
    /// Optional explicit peer list for transports that need it (UDP/dev mode).
    #[serde(default)]
    pub peers: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AgentCfg {
    pub retry_limit: u32,
    pub chain_timeout_ms: u64,
    /// Total nodes in the ring (default 206).
    #[serde(default = "default_ring")]
    pub ring_size: u16,
}

fn default_ring() -> u16 { 206 }

impl Config {
    pub fn load(path: &Path) -> Result<Self> {
        let raw = std::fs::read_to_string(path)
            .with_context(|| format!("reading config {}", path.display()))?;
        let cfg: Config = toml::from_str(&raw).context("parsing config.toml")?;
        anyhow::ensure!(
            cfg.node.id >= 1 && cfg.node.id <= cfg.agent.ring_size,
            "node.id out of range 1..={}",
            cfg.agent.ring_size
        );
        Ok(cfg)
    }
}