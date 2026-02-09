# TAM Federation Contract — ALA MEXA v1.0

## 1. Overview

ALA MEXA is a sovereign application module designed for independent operation and future federation with TAM Online. This contract defines the integration interface.

## 2. Identity

| Field | Type | Description |
|---|---|---|
| `local_user_id` | UUID | Primary user identity within Alamexa |
| `global_subject_id` | UUID (nullable) | TAM global identity, linked via federation |
| `issuer` | string | Always `"alamexa"` |

### Identity Contract
```json
{
  "local_id": "uuid",
  "global_id": "uuid | null",
  "issuer": "alamexa"
}
```

**Rule**: If `global_subject_id` is null, Alamexa operates independently. If set, TAM can correlate this user across modules.

## 3. Authentication

- JWT-based (Supabase Auth)
- Claims: `iss`, `sub`, `aud`, `exp`, `role`
- Refresh token rotation enabled
- Session persistence via `localStorage`

### Scopes
```
alamexa.read
alamexa.publish
alamexa.trade
alamexa.escrow
alamexa.admin
federation.sync
federation.anchor
```

## 4. APIs

### Book API (Self-Description)
```
GET /functions/v1/book-api
```
Returns capabilities, events, APIs, stats, and federation config.

### Health & Readiness
```
GET /functions/v1/health          → liveness
GET /functions/v1/health?type=ready → readiness
```

### Federation
```
GET  /functions/v1/federation?action=status  → user federation status
POST /functions/v1/federation?action=anchor  → link global identity
GET  /functions/v1/federation?action=events  → pending domain events (admin)
```

## 5. Domain Events (Event Outbox)

Events are stored in `event_outbox` table and emitted via triggers:

| Event | Source Table | Trigger |
|---|---|---|
| `PRODUCT_CREATED` | products | INSERT |
| `TRADE_PROPOSED` | trade_proposals | INSERT |
| `ESCROW_CREATED` | escrow_transactions | INSERT |
| `USER_VERIFIED` | kyc_verifications | UPDATE (level → verified) |

### Event Schema
```json
{
  "id": "uuid",
  "event_type": "PRODUCT_CREATED",
  "origin": "alamexa",
  "payload": {
    "table": "products",
    "operation": "INSERT",
    "record_id": "uuid",
    "timestamp": "ISO8601"
  },
  "published": false,
  "created_at": "ISO8601"
}
```

TAM subscribes to unpublished events via the federation endpoint. After processing, TAM marks events as published.

## 6. Data Tables

| Table | Purpose |
|---|---|
| profiles | User data + global_subject_id |
| products | Marketplace listings |
| trade_proposals | Barter negotiations |
| escrow_transactions | Fund custody |
| shipping_orders | Logistics tracking |
| kyc_verifications | Identity verification |
| memberships | Subscription tiers |
| event_outbox | Domain events for federation |
| federation_links | Identity mapping |

## 7. Capabilities

- Marketplace (buy/sell digital & physical products)
- Barter/Trade system with AI valuation
- Escrow custody for secure transactions
- KYC identity verification (4-step flow)
- Shipping integration (FedEx, DHL, Estafeta)
- AI Assistant (ALX)
- Memberships (Free, Basic, Pro)
- Real-time messaging
- Reviews & reputation system
- Push notifications

## 8. Fallback Behavior

If TAM is unavailable:
- Alamexa continues operating independently
- Events accumulate in outbox
- `global_subject_id` remains null for new users
- No functionality degrades

## 9. Security

- Row Level Security on all tables
- JWT validation on all authenticated endpoints
- Webhook signature verification (Stripe)
- Rate limiting via Supabase infrastructure
- Secrets stored externally (never in code)
- CORS configured per endpoint

## 10. Deployment

- Frontend: React + Vite (static SPA)
- Backend: Supabase (Postgres + Edge Functions)
- Container: Docker multi-stage build
- K8s: Deployment + Service + Ingress ready
- Health: `/health` and `/ready` endpoints

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-09  
**Status**: Production Ready
