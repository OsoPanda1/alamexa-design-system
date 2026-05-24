//! Ring chain token 1 → 206 → 1. Each node validates `next == self.id`,
//! re-signs, and forwards to its `next_id`. Closes when the token returns to
//! `chain_start`. Detects breaks via missing CHAIN_STEP within `chain_timeout`
//! and emits a skip-over to `next_next_id`.

use crate::config::Config;
use crate::message::Body;

pub fn next_step(cfg: &Config, round_id: u64, path: Vec<u16>) -> Body {
    Body::ChainStep {
        from_id: cfg.node.id,
        chain_start: *path.first().unwrap_or(&cfg.node.id),
        current: cfg.node.id,
        next: cfg.node.next_id,
        round_id,
        path,
    }
}

pub fn close_report(cfg: &Config, round_id: u64, path: Vec<u16>, breaks: Vec<u16>) -> Body {
    let complete_cycle = breaks.is_empty() && path.len() as u16 >= cfg.agent.ring_size;
    Body::ChainReport {
        from_id: cfg.node.id,
        round_id,
        path,
        complete_cycle,
        breaks,
    }
}

/// Compute the skip-over target when `next_id` is DOWN.
pub fn skip_over(cfg: &Config) -> u16 {
    (cfg.node.next_id % cfg.agent.ring_size) + 1
}