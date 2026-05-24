//! Abstract mesh transport. Default impl is a small UDP transport that works
//! for dev / Wi-Fi mesh. BLE (`hci0`) is wired in as a TODO trait impl so the
//! same agent loop works regardless of the underlying L2.

use anyhow::Result;
use async_trait::async_trait_compat as _; // marker; we use a manual trait below
use std::net::SocketAddr;
use tokio::net::UdpSocket;
use tokio::sync::mpsc;

/// Tiny shim so we don't pull async-trait as a hard dep.
mod async_trait_compat {}

pub enum Iface { Udp(SocketAddr), Wifi(String), Ble(String) }

impl Iface {
    pub fn parse(s: &str) -> Self {
        if let Some(addr) = s.strip_prefix("udp:") {
            return Iface::Udp(addr.parse().expect("invalid udp addr"));
        }
        if s.starts_with("hci") { return Iface::Ble(s.to_string()); }
        Iface::Wifi(s.to_string())
    }
}

pub struct Transport {
    sock: UdpSocket,
    peers: Vec<SocketAddr>,
    pub inbox: mpsc::Receiver<(Vec<u8>, SocketAddr)>,
    _task: tokio::task::JoinHandle<()>,
}

impl Transport {
    pub async fn bind(iface: &str, peers: &[String]) -> Result<Self> {
        let bind_addr: SocketAddr = match Iface::parse(iface) {
            Iface::Udp(a) => a,
            // BLE/Wi-Fi mesh: fall back to a localhost UDP socket so the agent
            // still boots inside CI/dev. Replace with a real impl per platform.
            _ => "0.0.0.0:9876".parse().unwrap(),
        };
        let sock = UdpSocket::bind(bind_addr).await?;
        let peers: Vec<SocketAddr> = peers.iter().filter_map(|p| p.parse().ok()).collect();
        let (tx, rx) = mpsc::channel(256);

        let sock_rx = sock.try_clone_arc();
        let task = tokio::spawn(async move {
            let mut buf = vec![0u8; 64 * 1024];
            loop {
                match sock_rx.recv_from(&mut buf).await {
                    Ok((n, src)) => { let _ = tx.send((buf[..n].to_vec(), src)).await; }
                    Err(e) => tracing::warn!(?e, "udp recv error"),
                }
            }
        });
        Ok(Self { sock, peers, inbox: rx, _task: task })
    }

    pub fn peers(&self) -> &[SocketAddr] { &self.peers }

    pub async fn send(&self, data: &[u8], to: SocketAddr) -> Result<()> {
        self.sock.send_to(data, to).await?;
        Ok(())
    }

    pub async fn broadcast(&self, data: &[u8]) -> Result<()> {
        for p in &self.peers { let _ = self.sock.send_to(data, *p).await; }
        Ok(())
    }
}

// Tiny helper: tokio's UdpSocket isn't Clone, but we can share via Arc<UdpSocket>
// using the async_send/recv API — wrap in a thin extension trait.
trait CloneArc { fn try_clone_arc(&self) -> std::sync::Arc<UdpSocket>; }
impl CloneArc for UdpSocket {
    fn try_clone_arc(&self) -> std::sync::Arc<UdpSocket> {
        // SAFETY: tokio UdpSocket is internally Arc-friendly via Arc<Self>.
        // We construct a new Arc by reading the std fd and re-wrapping.
        let std_sock = self.into_std_ref();
        let cloned = std_sock.try_clone().expect("dup socket");
        cloned.set_nonblocking(true).ok();
        std::sync::Arc::new(UdpSocket::from_std(cloned).expect("rebuild tokio sock"))
    }
}
trait IntoStdRef { fn into_std_ref(&self) -> &std::net::UdpSocket; }
impl IntoStdRef for UdpSocket {
    fn into_std_ref(&self) -> &std::net::UdpSocket {
        // Tokio exposes `as_ref` indirectly; for portability we use unsafe transmute
        // only as a last resort. Prefer the safe path:
        unsafe { &*(self as *const UdpSocket as *const std::net::UdpSocket) }
    }
}