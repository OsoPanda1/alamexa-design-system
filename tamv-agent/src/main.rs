//! tamv-agent — sovereign distributed micro-kernel for the TAMV ring (1→206→1).
//!
//! Single binary deployed across all 206 TAMV repos. Implements:
//!   * Anti-entropy gossip (push/pull) over BLE / Wi-Fi mesh
//!   * HMAC-authenticated chain token (1→2→…→206→1)
//!   * Self-healing skip-over on dead neighbours
//!   * Atomic persistent state (state.json)
//!
//! Only `config.toml` changes per node. The binary is identical for all 206.

use anyhow::Result;
use clap::Parser;
use std::path::PathBuf;
use tracing::info;

mod agent;
mod chain;
mod config;
mod gossip;
mod hmac;
mod message;
mod state;
mod transport;

#[derive(Parser, Debug)]
#[command(name = "tamv-agent", version, about = "TAMV sovereign mesh agent")]
struct Cli {
    /// Path to the per-node configuration file (config.toml).
    #[arg(long, default_value = "config.toml")]
    config: PathBuf,
    /// Path to the persistent state file (state.json).
    #[arg(long, default_value = "state.json")]
    state: PathBuf,
    /// Force initiator role for the chain (usually only node id == 1).
    #[arg(long)]
    initiator: bool,
}

#[tokio::main(flavor = "multi_thread")]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("tamv_agent=info")),
        )
        .init();

    let cli = Cli::parse();
    let cfg = config::Config::load(&cli.config)?;
    info!(node = cfg.node.id, "tamv-agent booting");

    let agent = agent::Agent::new(cfg, cli.state, cli.initiator).await?;
    agent.run().await
}