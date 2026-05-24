# tamv-agent

Sovereign distributed micro-kernel replicated across the **206 TAMV repos**.
Single Rust binary; only `config.toml` changes per node.

## What it does

1. **Anti-entropy gossip** over BLE / Wi-Fi mesh (push/pull, k = log₂N peers).
2. **HMAC-SHA256 authenticated chain token** 1 → 2 → … → 206 → 1.
3. **Self-healing skip-over** when `next_id` is DOWN beyond `retry_limit`.
4. **Atomic persistent state** (`state.json`, write-tmp + rename).

## Build

```bash
cd tamv-agent
cargo build --release
./target/release/tamv-agent --config config/config.example.toml --state ./state.json
```

## Deploy

- **Docker sidecar** — see `Dockerfile`. Run alongside the repo app container.
- **Bare metal** — `systemd/tamv-agent.service`, drop `config.toml` in `/etc/tamv/`.
- **CI/CD** — invoke binary from any pipeline; one process per repo.

## Protocol

| Message        | Purpose                                                   |
|----------------|-----------------------------------------------------------|
| `HELLO`        | I'm alive                                                 |
| `STATE_SYNC`   | Partial registry digest, merge via last-write-wins        |
| `CHAIN_STEP`   | Ring token; recipient validates `next == self.id`         |
| `CHAIN_REPORT` | Round result with `complete_cycle` + `breaks`             |

Every envelope carries `timestamp`, `nonce`, and a base64 HMAC-SHA256 `signature`.
Envelopes outside ±30s skew or with bad signatures are dropped.

## Federation with ALAMEXA

ALAMEXA (this repo) is **node 1** in the TAMV ring. The agent bridges the
`event_outbox` table to the rest of the ring via the `federation` edge function.
See `TAM_FEDERATION_CONTRACT.md` at the repo root for the full contract.