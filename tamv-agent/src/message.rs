//! Wire protocol: HELLO, STATE_SYNC, CHAIN_STEP, CHAIN_REPORT.
//! Every message carries timestamp + nonce + HMAC signature.

use crate::hmac::Signer;
use crate::state::NodeRecord;
use anyhow::{anyhow, Result};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Body {
    Hello { from_id: u16 },
    StateSync {
        from_id: u16,
        version: u64,
        partial_state: HashMap<u16, NodeRecord>,
    },
    ChainStep {
        from_id: u16,
        chain_start: u16,
        current: u16,
        next: u16,
        round_id: u64,
        path: Vec<u16>,
    },
    ChainReport {
        from_id: u16,
        round_id: u64,
        path: Vec<u16>,
        complete_cycle: bool,
        breaks: Vec<u16>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Envelope {
    pub timestamp: u64,
    pub nonce: String,
    pub body: Body,
    pub signature: String,
}

impl Envelope {
    pub fn new(body: Body, signer: &Signer) -> Result<Self> {
        let mut nonce_bytes = [0u8; 16];
        rand::thread_rng().fill_bytes(&mut nonce_bytes);
        let nonce = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, nonce_bytes);
        let timestamp = crate::state::now_ms();
        let payload = canonical_payload(timestamp, &nonce, &body)?;
        let signature = signer.sign(&payload);
        Ok(Self { timestamp, nonce, body, signature })
    }

    pub fn verify(&self, signer: &Signer, max_skew_ms: u64) -> Result<()> {
        let now = crate::state::now_ms();
        if now.saturating_sub(self.timestamp) > max_skew_ms
            && self.timestamp.saturating_sub(now) > max_skew_ms
        {
            return Err(anyhow!("envelope outside time window"));
        }
        let payload = canonical_payload(self.timestamp, &self.nonce, &self.body)?;
        if !signer.verify(&payload, &self.signature) {
            return Err(anyhow!("HMAC signature invalid"));
        }
        Ok(())
    }
}

fn canonical_payload(ts: u64, nonce: &str, body: &Body) -> Result<Vec<u8>> {
    let v = serde_json::json!({ "ts": ts, "nonce": nonce, "body": body });
    Ok(serde_json::to_vec(&v)?)
}