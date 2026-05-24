//! Push/pull anti-entropy gossip. Selects k = ceil(log2(N)) peers per round,
//! sends a partial state digest, and merges incoming sync messages via
//! last-write-wins on `last_seen`.

use crate::message::Body;
use crate::state::{NodeRecord, State};
use rand::seq::SliceRandom;
use std::collections::HashMap;

pub fn fanout(ring_size: u16) -> usize {
    ((ring_size as f64).log2().ceil() as usize).max(1)
}

/// Build a partial state digest to gossip.
pub fn build_digest(state: &State, max_entries: usize) -> Body {
    let mut entries: Vec<(u16, NodeRecord)> = state
        .registry
        .iter()
        .map(|(k, v)| (*k, v.clone()))
        .collect();
    entries.shuffle(&mut rand::thread_rng());
    entries.truncate(max_entries);
    let partial_state: HashMap<u16, NodeRecord> = entries.into_iter().collect();
    Body::StateSync {
        from_id: state.local_id,
        version: state.current_round,
        partial_state,
    }
}

/// Last-write-wins merge of a remote partial state into the local registry.
pub fn merge(state: &mut State, incoming: HashMap<u16, NodeRecord>) {
    for (id, remote) in incoming {
        let local = state.registry.entry(id).or_default();
        let local_seen = local.last_seen.unwrap_or(0);
        let remote_seen = remote.last_seen.unwrap_or(0);
        if remote_seen > local_seen {
            *local = remote;
        }
    }
}