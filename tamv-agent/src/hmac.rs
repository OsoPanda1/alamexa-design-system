//! HMAC-SHA256 message authentication using `ring`.

use anyhow::{Context, Result};
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use ring::hmac;

pub struct Signer {
    key: hmac::Key,
}

impl Signer {
    pub fn from_b64(secret_b64: &str) -> Result<Self> {
        let raw = B64.decode(secret_b64).context("decoding base64 secret_key")?;
        Ok(Self { key: hmac::Key::new(hmac::HMAC_SHA256, &raw) })
    }

    pub fn sign(&self, data: &[u8]) -> String {
        let tag = hmac::sign(&self.key, data);
        B64.encode(tag.as_ref())
    }

    pub fn verify(&self, data: &[u8], signature_b64: &str) -> bool {
        let Ok(sig) = B64.decode(signature_b64) else { return false };
        hmac::verify(&self.key, data, &sig).is_ok()
    }
}