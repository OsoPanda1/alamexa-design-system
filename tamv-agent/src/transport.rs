//! Abstract mesh transport. Default impl is a UDP transport that works for
//! dev / Wi-Fi mesh. `wlan0` / `hci0` (BLE) plug in here via the same API.

use anyhow::Result;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::UdpSocket;
use tokio::sync::mpsc;

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
    sock: Arc<UdpSocket>,
    peers: Vec<SocketAddr>,
    pub inbox: mpsc::Receiver<(Vec<u8>, SocketAddr)>,
}

impl Transport {
    pub async fn bind(iface: &str, peers: &[String]) -> Result<Self> {
        let bind_addr: SocketAddr = match Iface::parse(iface) {
            Iface::Udp(a) => a,
            // BLE/Wi-Fi mesh stubs fall back to localhost UDP so the agent
            // still boots in CI/dev. Replace with platform-specific impls.
            _ => "0.0.0.0:9876".parse().unwrap(),
        };
        let sock = Arc::new(UdpSocket::bind(bind_addr).await?);
        let peers: Vec<SocketAddr> = peers.iter().filter_map(|p| p.parse().ok()).collect();
        let (tx, rx) = mpsc::channel(256);

        let sock_rx = sock.clone();
        tokio::spawn(async move {
            let mut buf = vec![0u8; 64 * 1024];
            loop {
                match sock_rx.recv_from(&mut buf).await {
                    Ok((n, src)) => { let _ = tx.send((buf[..n].to_vec(), src)).await; }
                    Err(e) => tracing::warn!(?e, "udp recv error"),
                }
            }
        });
        Ok(Self { sock, peers, inbox: rx })
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