# Sidecar image for tamv-agent. Multi-stage, static-ish (musl) binary.
FROM rust:1.81-alpine AS builder
RUN apk add --no-cache musl-dev pkgconfig openssl-dev
WORKDIR /build
COPY Cargo.toml ./
COPY src ./src
RUN cargo build --release --locked || cargo build --release

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tini && adduser -D -u 10001 tamv
COPY --from=builder /build/target/release/tamv-agent /usr/local/bin/tamv-agent
USER tamv
WORKDIR /var/lib/tamv
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/tamv-agent"]
CMD ["--config", "/etc/tamv/config.toml", "--state", "/var/lib/tamv/state.json"]