# BengalStitch — Technical Blueprint
## Bangladesh-Focused Print-on-Demand Marketplace

> **Codename:** The Luminous Nexus
> **Version:** 1.0 — MVP Specification
> **Date:** April 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack Decisions](#3-tech-stack-decisions)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Database Schema](#5-database-schema)
6. [Backend Microservices](#6-backend-microservices)
7. [API Endpoints](#7-api-endpoints)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Design System](#9-design-system)
10. [Product Creation Flow](#10-product-creation-flow)
11. [Payment Architecture](#11-payment-architecture)
12. [3D / Mockup / Try-On Pipeline](#12-3d-mockup-try-on-pipeline)
13. [Media Pipeline](#13-media-pipeline)
14. [Fulfillment Logic](#14-fulfillment-logic)
15. [AI Features](#15-ai-features)
16. [Security & Scalability](#16-security--scalability)
17. [Business Model](#17-business-model)
18. [MVP Roadmap](#18-mvp-roadmap)
19. [V2 Roadmap](#19-v2-roadmap)
20. [Risks & Mitigations](#20-risks--mitigations)
21. [Scaling Plan](#21-scaling-plan)
22. [Third-Party Services](#22-third-party-services)
23. [TypeScript Interfaces](#23-typescript-interfaces)
24. [Example API Contracts](#24-example-api-contracts)
25. [Development Timeline](#25-development-timeline)

---

## 1. Executive Summary

BengalStitch is a print-on-demand SaaS marketplace built for Bangladeshi creators and global sellers. It combines:

- **Marketplace** — Buyers browse and purchase products
- **Creator Dashboard** — Sellers manage products, earnings, stores
- **Design Studio** — Canva-like editor for product customization
- **3D Try-On** — Interactive avatar-based clothing preview
- **Payment Hub** — bKash / Nagad / Stripe / PayPal with auto-split
- **Fulfillment Engine** — Pathao / RedX / DHL integration

**Core differentiators:**
- Bangladesh-first payments (bKash, Nagad, SSLCommerz)
- Works on low-end Android / slow connections (< 1MB initial bundle)
- One-link selling (no store required)
- 3D animated product previews with virtual try-on
- Bangla + English i18n

---

## 2. System Architecture

```
                    ┌──────────────────────────────────┐
                    │          CDN (CloudFront)         │
                    └──────────┬───────────────────────┘
                               │
                    ┌──────────▼───────────────────────┐
                    │   Next.js 15 (Vercel / ECS)      │
                    │   SSR + ISR + Client SPA          │
                    └──────────┬───────────────────────┘
                               │  REST + GraphQL + WS
                    ┌──────────▼───────────────────────┐
                    │       API Gateway (Kong / AWS)    │
                    │   Rate Limit · Auth · Routing     │
                    └──────────┬───────────────────────┘
                               │
          ┌────────────────────┼────────────────────────┐
          │                    │                         │
    ┌─────▼──────┐    ┌───────▼────────┐    ┌──────────▼────────┐
    │ Auth Svc   │    │ Product Svc    │    │ Payment Svc       │
    │ (NestJS)   │    │ (NestJS)       │    │ (NestJS)          │
    └─────┬──────┘    └───────┬────────┘    └──────────┬────────┘
          │                   │                        │
    ┌─────▼──────┐    ┌───────▼────────┐    ┌──────────▼────────┐
    │ User Svc   │    │ Design Svc     │    │ Order Svc         │
    └─────┬──────┘    └───────┬────────┘    └──────────┬────────┘
          │                   │                        │
    ┌─────▼──────┐    ┌───────▼────────┐    ┌──────────▼────────┐
    │ Store Svc  │    │ Mockup Svc     │    │ Fulfillment Svc   │
    └────────────┘    └───────┬────────┘    └───────────────────┘
                              │
                    ┌─────────▼────────────┐
                    │ AI Processing Svc    │
                    │ (Python / FastAPI)   │
                    └──────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │                  Shared Infrastructure                    │
    │  PostgreSQL · Redis · RabbitMQ · S3 · Elasticsearch      │
    └──────────────────────────────────────────────────────────┘
```

**Architecture Decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo vs Polyrepo | **Monorepo (Turborepo)** | Shared types, atomic deploys, single CI |
| API Style | **REST (public) + GraphQL (dashboard)** | REST for simplicity/caching; GraphQL for complex dashboard queries |
| Message Queue | **RabbitMQ** | Simpler ops than Kafka for MVP; switch at >100K orders/day |
| Rendering | **Next.js ISR** | SEO for product pages + fast TTFB on slow BD networks |
| State | **Zustand** | Lighter than Redux; sufficient for our needs |
| ORM | **Prisma** | Type-safe, great DX, migration tooling |

---

## 3. Tech Stack Decisions

### Frontend

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js | 15 | App Router, RSC, ISR, SEO |
| Language | TypeScript | 5.x | Type safety across stack |
| Styling | Tailwind CSS | 4.x | Matches existing design tokens |
| Components | shadcn/ui | latest | Accessible, customizable |
| State | Zustand | 5.x | Lightweight, simple |
| Data Fetching | TanStack Query | 5.x | Caching, optimistic updates |
| Forms | React Hook Form + Zod | latest | Validation, performance |
| 3D | React Three Fiber + Three.js | latest | Product previews, avatars |
| Animation | Framer Motion | latest | Micro-interactions |
| i18n | next-intl | latest | Bangla + English |
| Charts | Recharts | latest | Analytics dashboards |

### Backend

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | NestJS | 11.x | Modular, TypeScript-native, microservice support |
| Language | TypeScript | 5.x | Shared types with frontend |
| ORM | Prisma | 6.x | Type-safe DB access |
| Database | PostgreSQL | 16 | Relational, JSONB for flexible fields |
| Cache | Redis | 7.x | Session, rate limit, queues |
| Search | Elasticsearch | 8.x | Product search, autocomplete |
| Queue | RabbitMQ | 3.x | Order processing, notifications |
| Auth | JWT + Refresh Tokens | — | Stateless, scalable |
| File Storage | AWS S3 / Cloudflare R2 | — | Images, designs, exports |
| Media | Cloudinary | — | On-the-fly image transforms |
| Realtime | WebSocket (Socket.io) | — | Order status, notifications |

### AI / ML

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Image Gen | Stable Diffusion / DALL-E API | Design generation |
| Background Removal | rembg / Remove.bg API | Clean design assets |
| Upscaling | Real-ESRGAN | Print-quality images |
| Text Gen | GPT-4 API | Product titles, SEO descriptions |
| Body Detection | MediaPipe / OpenPose | Virtual try-on |

### Infrastructure

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Container | Docker | Consistent environments |
| Orchestration | Kubernetes (EKS) | Auto-scaling, rolling deploys |
| CI/CD | GitHub Actions | Free for open-source, fast |
| IaC | Terraform | Reproducible infrastructure |
| Monitoring | Grafana + Prometheus | Metrics, alerting |
| Logging | ELK Stack | Centralized logs |
| CDN | CloudFront / Cloudflare | Bangladesh PoP for fast delivery |
| DNS | Cloudflare | DDoS protection, fast resolution |

---

## 4. Monorepo Structure

```
bengalstitch/
├── apps/
│   ├── web/                          # Next.js 15 frontend
│   │   ├── app/                      # App Router pages
│   │   │   ├── (public)/             # Public pages group
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── marketplace/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── product/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── store/
│   │   │   │   │   └── [username]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── pricing/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── blog/
│   │   │   │       └── page.tsx
│   │   │   ├── (auth)/               # Auth pages group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx
│   │   │   ├── (creator)/            # Creator dashboard group
│   │   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── studio/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── earnings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── store-settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── payment-setup/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── affiliates/
│   │   │   │       └── page.tsx
│   │   │   ├── (admin)/              # Admin dashboard group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── users/
│   │   │   │   │   ├── sellers/
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── orders/
│   │   │   │   │   ├── revenue/
│   │   │   │   │   ├── moderation/
│   │   │   │   │   └── support/
│   │   │   │   └── ...
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui primitives
│   │   │   ├── layout/               # Header, Footer, Sidebar
│   │   │   ├── marketplace/          # Product cards, filters
│   │   │   ├── studio/               # Design editor components
│   │   │   ├── 3d/                   # Three.js / R3F components
│   │   │   ├── checkout/             # Cart, payment forms
│   │   │   ├── dashboard/            # Charts, stats cards
│   │   │   └── shared/               # Common reusable
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── auth.ts               # Auth helpers
│   │   │   └── utils.ts
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── auth.store.ts
│   │   │   ├── cart.store.ts
│   │   │   ├── studio.store.ts
│   │   │   └── ui.store.ts
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   └── bn.json
│   │   ├── public/
│   │   │   ├── models/               # 3D model files
│   │   │   └── images/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   └── google.strategy.ts
│       │   │   │   ├── guards/
│       │   │   │   │   ├── jwt.guard.ts
│       │   │   │   │   └── roles.guard.ts
│       │   │   │   └── dto/
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   ├── products/
│       │   │   │   ├── products.module.ts
│       │   │   │   ├── products.controller.ts
│       │   │   │   ├── products.service.ts
│       │   │   │   ├── products.resolver.ts     # GraphQL
│       │   │   │   └── dto/
│       │   │   ├── designs/
│       │   │   ├── stores/
│       │   │   ├── orders/
│       │   │   ├── payments/
│       │   │   ├── fulfillment/
│       │   │   ├── notifications/
│       │   │   ├── analytics/
│       │   │   ├── ai/
│       │   │   ├── mockups/
│       │   │   └── files/
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   ├── interceptors/
│       │   │   ├── pipes/
│       │   │   └── guards/
│       │   ├── config/
│       │   ├── prisma/
│       │   │   ├── schema.prisma
│       │   │   └── migrations/
│       │   ├── graphql/
│       │   │   └── schema.gql
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       ├── nest-cli.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared/                       # Shared types, constants, utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── product.types.ts
│   │   │   │   ├── order.types.ts
│   │   │   │   ├── payment.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── product-types.ts
│   │   │   │   ├── payment-gateways.ts
│   │   │   │   ├── order-status.ts
│   │   │   │   └── currencies.ts
│   │   │   ├── validators/
│   │   │   │   └── schemas.ts         # Zod schemas
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui/                           # Shared UI components (design system)
│   │   ├── src/
│   │   │   ├── tokens.ts             # Design tokens from Luminous Nexus
│   │   │   └── components/
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config/                       # Shared configs
│       ├── eslint/
│       ├── tsconfig/
│       └── tailwind/
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── nginx.conf
│
├── infra/                            # Terraform / K8s
│   ├── terraform/
│   └── k8s/
│
├── stitch/                           # Existing design assets (read-only reference)
│   ├── DESIGN.md
│   └── code.html
│
├── turbo.json
├── package.json                      # Root workspace
├── .gitignore
├── .env.example
├── BLUEPRINT.md                      # This document
└── README.md
```

---

## 5. Database Schema

### Entity Relationship Overview

```
users ──┬── creator_profiles ── stores
        │         │
        │         ├── products ── product_variants
        │         │      │              │
        │         │      └── product_designs
        │         │
        │         └── affiliate_links
        │
        ├── orders ── order_items ── payments
        │                              │
        │                              └── payouts
        │
        ├── reviews
        ├── favorites
        └── carts ── cart_items
```

### Full Prisma Schema

See `apps/api/src/prisma/schema.prisma` for the complete schema. Key tables:

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | NULLABLE |
| full_name | VARCHAR(255) | NOT NULL |
| avatar_url | TEXT | NULLABLE |
| country | VARCHAR(2) | DEFAULT 'BD' |
| language | VARCHAR(5) | DEFAULT 'en' |
| role | ENUM | USER, CREATOR, ADMIN |
| is_verified | BOOLEAN | DEFAULT false |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now |
| updated_at | TIMESTAMP | auto-update |

**Indexes:** email (unique), phone, role, country

#### creator_profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK -> users, UNIQUE |
| store_name | VARCHAR(100) | UNIQUE |
| store_slug | VARCHAR(100) | UNIQUE |
| bio | TEXT | NULLABLE |
| logo_url | TEXT | NULLABLE |
| banner_url | TEXT | NULLABLE |
| subscription_tier | ENUM | FREE, PRO, BRAND, ENTERPRISE |
| commission_rate | DECIMAL(5,2) | DEFAULT 20.00 |
| total_earnings | DECIMAL(12,2) | DEFAULT 0 |
| total_sales | INT | DEFAULT 0 |
| payout_method | ENUM | BKASH, NAGAD, BANK, PAYPAL, WISE |
| payout_details | JSONB | encrypted payment info |
| is_verified_seller | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | DEFAULT now |

**Indexes:** user_id (unique), store_slug (unique), subscription_tier

#### products
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| creator_id | UUID | FK -> creator_profiles |
| title | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE |
| description | TEXT | NULLABLE |
| product_type | ENUM | TSHIRT, HOODIE, MUG, PHONE_CASE, TOTE_BAG, POSTER, CAP, SHOES, JEWELRY |
| base_price | DECIMAL(10,2) | NOT NULL |
| selling_price | DECIMAL(10,2) | NOT NULL |
| profit_margin | DECIMAL(10,2) | computed |
| currency | VARCHAR(3) | DEFAULT 'BDT' |
| status | ENUM | DRAFT, ACTIVE, PAUSED, ARCHIVED |
| tags | TEXT[] | array of strings |
| seo_title | VARCHAR(255) | NULLABLE |
| seo_description | TEXT | NULLABLE |
| view_count | INT | DEFAULT 0 |
| sale_count | INT | DEFAULT 0 |
| is_featured | BOOLEAN | DEFAULT false |
| mockup_urls | JSONB | {front, back, side, 3d} |
| created_at | TIMESTAMP | DEFAULT now |
| updated_at | TIMESTAMP | auto-update |

**Indexes:** creator_id, slug (unique), product_type, status, is_featured, created_at DESC

#### product_variants
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK -> products |
| size | VARCHAR(10) | NULLABLE (XS, S, M, L, XL, 2XL, 3XL) |
| color | VARCHAR(50) | NULLABLE |
| color_hex | VARCHAR(7) | NULLABLE |
| sku | VARCHAR(100) | UNIQUE |
| additional_price | DECIMAL(10,2) | DEFAULT 0 |
| stock_status | ENUM | IN_STOCK, LOW, OUT_OF_STOCK |
| weight_grams | INT | NULLABLE |

**Indexes:** product_id, sku (unique)

#### product_designs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK -> products |
| design_url | TEXT | NOT NULL |
| thumbnail_url | TEXT | NOT NULL |
| placement | ENUM | FRONT, BACK, LEFT, RIGHT, ALL_OVER |
| position_x | FLOAT | DEFAULT 50 |
| position_y | FLOAT | DEFAULT 50 |
| scale | FLOAT | DEFAULT 100 |
| rotation | FLOAT | DEFAULT 0 |
| layers | JSONB | design layer data |
| created_at | TIMESTAMP | DEFAULT now |

#### orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_number | VARCHAR(20) | UNIQUE, auto-generated |
| buyer_id | UUID | FK -> users |
| status | ENUM | PENDING, PAID, PROCESSING, PRINTED, SHIPPED, DELIVERED, RETURNED, CANCELLED |
| subtotal | DECIMAL(12,2) | NOT NULL |
| shipping_cost | DECIMAL(10,2) | DEFAULT 0 |
| tax | DECIMAL(10,2) | DEFAULT 0 |
| total | DECIMAL(12,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT 'BDT' |
| shipping_address | JSONB | {name, line1, line2, city, state, zip, country, phone} |
| tracking_number | VARCHAR(100) | NULLABLE |
| courier | VARCHAR(50) | NULLABLE |
| notes | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now |
| updated_at | TIMESTAMP | auto-update |

**Indexes:** order_number (unique), buyer_id, status, created_at DESC

#### order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK -> orders |
| product_id | UUID | FK -> products |
| variant_id | UUID | FK -> product_variants |
| creator_id | UUID | FK -> creator_profiles |
| quantity | INT | NOT NULL, MIN 1 |
| unit_price | DECIMAL(10,2) | NOT NULL |
| total_price | DECIMAL(10,2) | NOT NULL |
| design_snapshot | JSONB | frozen design data at time of purchase |

#### payments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK -> orders |
| gateway | ENUM | BKASH, NAGAD, ROCKET, SSLCOMMERZ, STRIPE, PAYPAL |
| gateway_txn_id | VARCHAR(255) | NULLABLE |
| amount | DECIMAL(12,2) | NOT NULL |
| currency | VARCHAR(3) | NOT NULL |
| status | ENUM | PENDING, COMPLETED, FAILED, REFUNDED |
| gateway_response | JSONB | raw gateway response |
| paid_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now |

**Indexes:** order_id, gateway, status, gateway_txn_id

#### payouts
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| creator_id | UUID | FK -> creator_profiles |
| amount | DECIMAL(12,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT 'BDT' |
| method | ENUM | BKASH, NAGAD, BANK, PAYPAL, WISE, PAYONEER |
| status | ENUM | PENDING, PROCESSING, COMPLETED, FAILED |
| reference | VARCHAR(255) | NULLABLE |
| processed_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now |

#### reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK -> products |
| user_id | UUID | FK -> users |
| rating | INT | 1-5 |
| title | VARCHAR(255) | NULLABLE |
| body | TEXT | NULLABLE |
| images | TEXT[] | NULLABLE |
| is_verified_purchase | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | DEFAULT now |

**Indexes:** product_id, user_id, rating

#### affiliate_links
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| creator_id | UUID | FK -> creator_profiles |
| product_id | UUID | FK -> products |
| code | VARCHAR(20) | UNIQUE |
| commission_percent | DECIMAL(5,2) | DEFAULT 10 |
| click_count | INT | DEFAULT 0 |
| conversion_count | INT | DEFAULT 0 |
| total_earned | DECIMAL(12,2) | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now |

#### subscriptions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| creator_id | UUID | FK -> creator_profiles |
| plan | ENUM | FREE, PRO, BRAND, ENTERPRISE |
| status | ENUM | ACTIVE, CANCELLED, EXPIRED, TRIAL |
| started_at | TIMESTAMP | NOT NULL |
| expires_at | TIMESTAMP | NULLABLE |
| gateway | VARCHAR(50) | NULLABLE |
| gateway_sub_id | VARCHAR(255) | NULLABLE |

#### coupons
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| code | VARCHAR(30) | UNIQUE |
| discount_type | ENUM | PERCENTAGE, FIXED |
| discount_value | DECIMAL(10,2) | NOT NULL |
| min_order_value | DECIMAL(10,2) | DEFAULT 0 |
| max_uses | INT | NULLABLE |
| used_count | INT | DEFAULT 0 |
| valid_from | TIMESTAMP | NOT NULL |
| valid_until | TIMESTAMP | NULLABLE |
| is_active | BOOLEAN | DEFAULT true |

#### analytics_events
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| event_type | VARCHAR(50) | NOT NULL |
| entity_type | VARCHAR(50) | NULLABLE |
| entity_id | UUID | NULLABLE |
| user_id | UUID | NULLABLE |
| metadata | JSONB | NULLABLE |
| ip_address | INET | NULLABLE |
| user_agent | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now |

**Indexes:** event_type, entity_type + entity_id, user_id, created_at DESC
**Note:** Partitioned by month for performance.

#### notification_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK -> users |
| type | ENUM | ORDER, PAYMENT, PAYOUT, SYSTEM, PROMO |
| channel | ENUM | EMAIL, SMS, PUSH, IN_APP |
| title | VARCHAR(255) | NOT NULL |
| body | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT false |
| sent_at | TIMESTAMP | DEFAULT now |

---

## 6. Backend Microservices

### Service Responsibilities

| # | Service | Port | Responsibilities |
|---|---------|------|-----------------|
| 1 | **Auth Service** | 3001 | Signup, login, JWT issue/refresh, OAuth (Google), password reset, email verification |
| 2 | **User Service** | 3002 | Profile CRUD, creator profile management, avatar upload, preferences |
| 3 | **Product Service** | 3003 | Product CRUD, variants, search, catalog management, SEO metadata |
| 4 | **Design Service** | 3004 | Design upload, layer management, template save/load, design asset storage |
| 5 | **Payment Service** | 3005 | Payment initiation, webhook processing, refunds, multi-gateway routing |
| 6 | **Order Service** | 3006 | Cart management, order creation, status updates, order history |
| 7 | **Fulfillment Service** | 3007 | Courier integration, shipping label generation, tracking sync |
| 8 | **Notification Service** | 3008 | Email, SMS, push, in-app notifications via queue |
| 9 | **Analytics Service** | 3009 | Event ingestion, aggregation, dashboard data, reports |
| 10 | **AI Processing Service** | 3010 | Image generation, background removal, upscaling, text generation |
| 11 | **Mockup Rendering Service** | 3011 | 3D render generation, product mockup snapshots, video export |
| 12 | **File Storage Service** | 3012 | Upload handling, image optimization, CDN URL generation, WebP conversion |

### Inter-Service Communication

```
┌─────────┐     HTTP/gRPC      ┌──────────┐
│ Order    │ ──────────────────> │ Payment  │  (sync: create payment)
│ Service  │                    │ Service  │
└────┬─────┘                    └──────────┘
     │ RabbitMQ (async)
     ├──> Fulfillment Service   (order.paid event)
     ├──> Notification Service  (order.created event)
     ├──> Analytics Service     (order.* events)
     └──> Payment Service       (order.refund.requested)

┌─────────┐     RabbitMQ        ┌──────────┐
│ Product  │ ──────────────────> │ Mockup   │  (product.design.uploaded)
│ Service  │                    │ Rendering │
└──────────┘                    └──────────┘

┌─────────┐     RabbitMQ        ┌──────────┐
│ File     │ ──────────────────> │ AI       │  (file.uploaded.needs_processing)
│ Storage  │                    │ Service  │
└──────────┘                    └──────────┘
```

### Queue Topics

| Queue | Publisher | Consumer | Purpose |
|-------|-----------|----------|---------|
| `order.created` | Order Svc | Notification, Analytics | New order alerts |
| `order.paid` | Payment Svc | Order, Fulfillment, Notification | Trigger fulfillment |
| `order.shipped` | Fulfillment Svc | Notification, Analytics | Tracking updates |
| `payment.completed` | Payment Svc | Order Svc | Confirm payment |
| `payment.failed` | Payment Svc | Order, Notification | Handle failure |
| `payout.requested` | Creator Dashboard | Payment Svc | Process withdrawal |
| `design.uploaded` | Design Svc | Mockup Svc, File Svc | Generate mockups |
| `file.optimized` | File Svc | Product Svc | Update URLs |
| `ai.task.queued` | Design Svc | AI Svc | Background AI processing |

### Retry & Failure Handling

- **Retry policy:** Exponential backoff, max 5 retries, dead-letter queue
- **Circuit breaker:** On external APIs (payment gateways, couriers)
- **Idempotency keys:** On all payment and order mutations
- **Saga pattern:** For order creation (reserve → pay → fulfill → notify)

---

## 7. API Endpoints

### REST API (Public + Creator)

#### Auth (`/api/v1/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Email/password login |
| POST | `/login/google` | Google OAuth |
| POST | `/refresh` | Refresh JWT |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password` | Set new password |
| POST | `/verify-email` | Verify email token |
| POST | `/logout` | Invalidate refresh token |

#### Users (`/api/v1/users`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Current user profile |
| PATCH | `/me` | Update profile |
| POST | `/me/avatar` | Upload avatar |
| POST | `/me/become-creator` | Upgrade to creator |
| GET | `/me/notifications` | List notifications |
| PATCH | `/me/notifications/:id/read` | Mark notification read |

#### Products (`/api/v1/products`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List/search products (public) |
| GET | `/:slug` | Product detail (public) |
| POST | `/` | Create product (creator) |
| PATCH | `/:id` | Update product (creator) |
| DELETE | `/:id` | Delete product (creator) |
| POST | `/:id/variants` | Add variant |
| PATCH | `/:id/variants/:vid` | Update variant |
| DELETE | `/:id/variants/:vid` | Delete variant |
| POST | `/:id/designs` | Upload design for product |
| GET | `/:id/reviews` | List reviews |
| POST | `/:id/reviews` | Add review |

#### Orders (`/api/v1/orders`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create order (buyer) |
| GET | `/` | List my orders |
| GET | `/:id` | Order detail |
| POST | `/:id/cancel` | Cancel order |
| GET | `/creator` | Creator's received orders |

#### Cart (`/api/v1/cart`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get cart |
| POST | `/items` | Add to cart |
| PATCH | `/items/:id` | Update quantity |
| DELETE | `/items/:id` | Remove item |
| DELETE | `/` | Clear cart |

#### Payments (`/api/v1/payments`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/initiate` | Start payment flow |
| POST | `/webhook/bkash` | bKash webhook |
| POST | `/webhook/nagad` | Nagad webhook |
| POST | `/webhook/stripe` | Stripe webhook |
| POST | `/webhook/sslcommerz` | SSLCommerz IPN |
| GET | `/verify/:txnId` | Verify payment status |

#### Creator Store (`/api/v1/stores`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/:slug` | Public store page data |
| PATCH | `/me` | Update store settings |
| POST | `/me/logo` | Upload store logo |
| POST | `/me/banner` | Upload store banner |

#### Payouts (`/api/v1/payouts`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List payouts |
| POST | `/request` | Request withdrawal |
| GET | `/balance` | Current balance |

#### Affiliates (`/api/v1/affiliates`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/links` | Create affiliate link |
| GET | `/links` | List my links |
| GET | `/links/:code/stats` | Link analytics |
| GET | `/track/:code` | Track click + redirect |

#### Admin (`/api/v1/admin`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| PATCH | `/users/:id/role` | Change user role |
| PATCH | `/users/:id/ban` | Ban/unban user |
| GET | `/products` | All products (moderation) |
| PATCH | `/products/:id/status` | Approve/reject product |
| GET | `/orders` | All orders |
| GET | `/revenue` | Revenue dashboard data |
| GET | `/analytics` | Platform analytics |

### GraphQL (Creator Dashboard)

Used for the creator dashboard where complex, nested queries are common.

```graphql
type Query {
  me: User!
  myProducts(filter: ProductFilter, pagination: Pagination): ProductConnection!
  myOrders(filter: OrderFilter, pagination: Pagination): OrderConnection!
  myEarnings(period: Period!): EarningsReport!
  myAnalytics(period: Period!): AnalyticsReport!
  myStore: Store!
  myAffiliateLinks: [AffiliateLink!]!
  productDetail(id: ID!): Product!
}

type Mutation {
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
  updateStore(input: UpdateStoreInput!): Store!
  requestPayout(input: PayoutInput!): Payout!
  createAffiliateLink(productId: ID!): AffiliateLink!
}

type Subscription {
  orderUpdate(orderId: ID!): Order!
  newOrder: Order!
  notificationReceived: Notification!
}
```

---

## 8. Frontend Architecture

### Page Hierarchy & Components

#### Landing Page (`/`)
- **Components:** HeroSection, ProductCarousel3D, HowItWorks, TrendingCreations (BentoGrid), PaymentPartners, FinalCTA, Footer
- **Mobile:** Stack hero vertically, single-column carousel, collapsed bento
- **Desktop:** Split hero with 3D product, 4-column bento, full-width carousels
- **Animations:** Parallax hero, staggered card entrance, floating 3D product rotate
- **Loading:** Skeleton shimmer on cards, blur-up on images
- **Empty:** N/A (static content)

#### Marketplace (`/marketplace`)
- **Components:** SearchBar, FilterSidebar (mobile: bottom sheet), ProductGrid, ProductCard, SortDropdown, PaginationBar, CategoryChips
- **Mobile:** Full-width search, bottom-sheet filters, 2-column grid
- **Desktop:** Left sidebar filters, 3-4 column grid, infinite scroll
- **Animations:** Card entrance stagger, filter slide, skeleton loading
- **Loading:** Grid of 12 skeleton cards
- **Empty:** "No products found" with illustration + suggestion chips

#### Product Detail (`/product/[slug]`)
- **Components:** ImageGallery3D, ProductInfo, VariantSelector, AddToCartButton, DesignPreview, ReviewList, CreatorBadge, RelatedProducts, ShareButton, TryOnButton
- **Mobile:** Stacked layout, sticky "Add to Cart" bottom bar
- **Desktop:** 2-column (gallery left, info right), tabbed reviews
- **Animations:** Image zoom on hover, smooth variant switch, 3D rotate gesture
- **Loading:** Image skeleton + text shimmer
- **Empty:** 404 product page

#### Creator Dashboard (`/dashboard`)
- **Components:** DashboardSidebar, StatsCards (revenue, orders, views, conversion), RecentOrders, TopProducts, EarningsChart, QuickActions
- **Mobile:** Bottom navigation, condensed stats row
- **Desktop:** Collapsible sidebar, grid stats, charts
- **Animations:** Counter-up on stats, chart draw-in
- **Loading:** Stats shimmer, chart placeholder
- **Empty:** Onboarding wizard (create first product)

#### Design Studio (`/studio`)
- **Components:** CanvasArea, ToolbarLeft (shapes, text, upload, AI), ToolbarTop (undo, redo, save, export), LayerPanel, PropertyPanel, ProductPreview3D, ColorPicker, FontSelector, StickerLibrary, AIGenerateModal
- **Mobile:** Simplified toolbar, full-screen canvas, bottom tool drawer
- **Desktop:** Multi-panel layout, floating panels, split preview
- **Animations:** Smooth tool transitions, real-time preview update
- **Loading:** Canvas skeleton, tool icons shimmer
- **Empty:** Template gallery prompt

#### Checkout (`/checkout`)
- **Components:** OrderSummary, ShippingForm, PaymentMethodSelector (bKash, Nagad, Stripe, PayPal tabs), CouponInput, PlaceOrderButton, OrderConfirmation
- **Mobile:** Single-column stepped flow
- **Desktop:** 2-column (form left, summary right)
- **Animations:** Step transition, payment method expand, success confetti
- **Loading:** Form shimmer
- **Empty:** Empty cart redirect

### State Management (Zustand)

```
stores/
├── auth.store.ts        # user, token, isAuthenticated, login(), logout()
├── cart.store.ts         # items[], addItem(), removeItem(), updateQty(), total
├── studio.store.ts       # canvas state, layers, selectedTool, history (undo/redo)
├── ui.store.ts           # theme, sidebar, modals, toasts
└── product.store.ts      # current product being viewed/edited, variants
```

### Data Fetching Strategy

| Page Type | Strategy | Rationale |
|-----------|----------|-----------|
| Landing | ISR (60s revalidate) | Near-static, SEO critical |
| Marketplace | SSR + client pagination | SEO for first page, fast browse |
| Product Detail | ISR (30s) | SEO critical, moderate updates |
| Creator Store | ISR (60s) | SEO, cacheable |
| Dashboard pages | CSR (TanStack Query) | Private, real-time data |
| Checkout | CSR | Private, dynamic |

---

## 9. Design System

Based on the **"Luminous Nexus"** specification from `stitch/DESIGN.md`.

### Color Tokens (Tailwind)

```typescript
const colors = {
  background: '#14121b',
  surface: '#14121b',
  'surface-dim': '#14121b',
  'surface-container-lowest': '#0f0d16',
  'surface-container-low': '#1c1a24',
  'surface-container': '#211e28',
  'surface-container-high': '#2b2933',
  'surface-container-highest': '#36333e',
  'surface-variant': '#36333e',
  'surface-bright': '#3b3842',
  primary: '#00dddd',
  'primary-container': '#005e5e',
  'primary-fixed': '#00fbfb',
  'primary-fixed-dim': '#00dddd',
  secondary: '#ffabf3',
  'secondary-container': '#fe00fe',
  tertiary: '#cfbdff',
  'tertiary-container': '#6200ee',
  error: '#ffb4ab',
  'error-container': '#93000a',
  'on-background': '#e6e0ee',
  'on-surface': '#e6e0ee',
  'on-surface-variant': '#cbc3d9',
  'on-primary': '#003737',
  'on-secondary': '#5b005b',
  'on-tertiary': '#3a0093',
  'on-error': '#690005',
  outline: '#948da2',
  'outline-variant': '#494456',
  'inverse-surface': '#e6e0ee',
  'inverse-on-surface': '#322f39',
  'inverse-primary': '#006a6a',
}
```

### Typography Scale

| Token | Font | Size | Weight | Letter Spacing | Usage |
|-------|------|------|--------|----------------|-------|
| display-lg | Plus Jakarta Sans | 57px | 800 | -2% | Hero headlines |
| display-md | Plus Jakarta Sans | 45px | 700 | -1.5% | Section heroes |
| headline-lg | Plus Jakarta Sans | 32px | 700 | -1% | Page titles |
| headline-md | Plus Jakarta Sans | 28px | 600 | -0.5% | Section titles |
| headline-sm | Plus Jakarta Sans | 24px | 600 | 0 | Card titles |
| title-lg | Inter | 22px | 600 | 0 | Subsections |
| title-md | Inter | 16px | 600 | 0.15px | Component titles |
| body-lg | Inter | 16px | 400 | 0.5px | Primary body |
| body-md | Inter | 14px | 400 | 0.25px | Secondary body |
| body-sm | Inter | 12px | 400 | 0.4px | Captions |
| label-lg | Inter | 14px | 600 | 0.1px | Buttons, tabs |
| label-md | Inter | 12px | 500 | 0.5px | Chips, badges |
| label-sm | Inter | 11px | 500 | 0.5px | Helper text |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| space-xs | 4px | Inline gaps |
| space-sm | 8px | Tight padding |
| space-md | 16px | Standard padding |
| space-lg | 24px | Section gaps |
| space-xl | 32px | Card padding |
| space-2xl | 48px | Section padding |
| space-3xl | 64px | Page sections |
| space-4xl | 96px | Hero sections |

### Component Variants

**Buttons:**
- Primary: Gradient `primary` -> `primary-container` at 135deg, rounded-md, uppercase label-md
- Secondary (Ghost): Transparent bg, outline-variant/15 border, secondary text
- Tertiary (Link): No bg, primary text, underline on hover
- Destructive: error bg, on-error text

**Cards:**
- Product Card: surface-container bg, rounded-[32px], no border, hover: translate-y-[-8px] + primary shadow + scale 1.02
- Stats Card: glass-card (rgba + backdrop-blur-20), rounded-xl
- Creator Card: surface-container-high bg, 2rem vertical padding between sections

**Inputs:**
- Default: surface-container-lowest bg, ghost border at 15% opacity
- Focus: primary border at 100%, primary shadow glow at 20% opacity
- Error: error border, error-container bg tint

---

## 10. Product Creation Flow

### Step-by-Step User Flow

```
Creator                    Frontend                   Backend                    External
  │                           │                          │                          │
  ├─ 1. Click "New Product"──>│                          │                          │
  │                           ├─ Show product type ──────┤                          │
  │                           │   selector modal         │                          │
  ├─ 2. Select "T-Shirt" ───>│                          │                          │
  │                           ├─ Open Design Studio ─────┤                          │
  │                           │                          │                          │
  ├─ 3. Upload design PNG ──>│                          │                          │
  │                           ├─ POST /files/upload ────>│                          │
  │                           │                          ├─ Optimize image ────────>│ S3
  │                           │                          ├─ Queue: bg removal ─────>│ AI Svc
  │                           │<── Return file URL ──────┤                          │
  │                           │                          │                          │
  ├─ 4. Position design ────>│                          │                          │
  │     on product canvas     │                          │                          │
  │                           │                          │                          │
  ├─ 5. Click "Preview" ────>│                          │                          │
  │                           ├─ POST /mockups/render ──>│                          │
  │                           │                          ├─ Queue: 3D render ──────>│ Render Svc
  │                           │<── Return mockup URLs ───┤                          │
  │                           │   {front, back, 3d}      │                          │
  │                           │                          │                          │
  ├─ 6. Set pricing ────────>│                          │                          │
  │     base: 500 BDT         │                          │                          │
  │     sell: 850 BDT         │                          │                          │
  │     margin: 350 BDT       │                          │                          │
  │                           │                          │                          │
  ├─ 7. Add variants ───────>│                          │                          │
  │     (S/M/L/XL, colors)    │                          │                          │
  │                           │                          │                          │
  ├─ 8. Click "Publish" ────>│                          │                          │
  │                           ├─ POST /products ────────>│                          │
  │                           │                          ├─ Validate                │
  │                           │                          ├─ Generate slug           │
  │                           │                          ├─ Create product + vars   │
  │                           │                          ├─ Index in Elasticsearch  │
  │                           │<── Product created ──────┤                          │
  │                           │   + shareable link       │                          │
  │                           │                          │                          │
  │<── Show success + link ───┤                          │                          │
  │    bengalstitch.com/p/my-tee   │                          │                          │
```

### Purchase Flow

```
Buyer visits link ──> Product page (ISR) ──> Add to cart
     │
     ├──> Checkout page
     │    ├── Shipping address form
     │    └── Payment method select
     │
     ├──> POST /orders (create order, status: PENDING)
     │
     ├──> POST /payments/initiate
     │    ├── bKash: redirect to bKash app / USSD
     │    ├── Nagad: redirect to Nagad gateway
     │    └── Stripe: Stripe Elements inline
     │
     ├──> Payment webhook received
     │    ├── Verify signature
     │    ├── Update payment status: COMPLETED
     │    ├── Update order status: PAID
     │    ├── Emit: order.paid
     │    │    ├── Split commission:
     │    │    │    Creator: 80% -> creator balance
     │    │    │    Platform: 20% -> platform revenue
     │    │    ├── Queue: fulfillment.process
     │    │    └── Queue: notification.send (buyer + creator)
     │    │
     │    ├── Fulfillment picks up order
     │    │    ├── Print product
     │    │    ├── status: PROCESSING -> PRINTED
     │    │    ├── Ship via Pathao/RedX
     │    │    ├── status: SHIPPED (tracking number assigned)
     │    │    └── Webhook from courier: DELIVERED
     │    │
     │    └── Creator can request payout when balance >= min threshold
```

---

## 11. Payment Architecture

### Multi-Gateway Routing

```typescript
class PaymentRouter {
  route(order: Order, method: PaymentMethod): PaymentGateway {
    switch (method) {
      case 'BKASH':    return new BkashGateway(config.bkash);
      case 'NAGAD':    return new NagadGateway(config.nagad);
      case 'ROCKET':   return new RocketGateway(config.rocket);
      case 'SSLCOMMERZ': return new SSLCommerzGateway(config.sslcommerz);
      case 'STRIPE':   return new StripeGateway(config.stripe);
      case 'PAYPAL':   return new PayPalGateway(config.paypal);
    }
  }
}
```

### Commission Split Logic

```
Total Sale Price: 850 BDT
├── Platform Commission (20%): 170 BDT
├── Creator Revenue (80%): 680 BDT
├── Payment Gateway Fee (~2%): 17 BDT (deducted from platform share)
└── Net Platform Revenue: 153 BDT
```

### Currency Conversion

- Primary: BDT (Bangladeshi Taka)
- Supported: USD, EUR, GBP
- Rate source: Open Exchange Rates API (cached 1hr in Redis)
- Conversion at checkout time, locked for 15 minutes
- Displayed in buyer's preferred currency, processed in seller's currency

### bKash Integration Flow

```
1. POST /payments/initiate {gateway: "BKASH", orderId}
2. Server calls bKash Tokenized API: /tokenized/checkout/create
3. Returns bKash deeplink URL
4. Buyer completes in bKash app
5. bKash calls our webhook: POST /payments/webhook/bkash
6. Server verifies with bKash /tokenized/checkout/execute
7. On success: update payment + order status
```

---

## 12. 3D / Mockup / Try-On Pipeline

### Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Design       │────>│ Mockup Queue     │────>│ Render Worker   │
│ Service      │     │ (RabbitMQ)       │     │ (Blender/Three) │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                               ┌───────▼────────┐
                                               │ Output:         │
                                               │ - Front PNG     │
                                               │ - Back PNG      │
                                               │ - 3D GLB model  │
                                               │ - 360° video    │
                                               │ - OG image      │
                                               └────────┬────────┘
                                                        │
                                               ┌────────▼────────┐
                                               │ S3 + CloudFront │
                                               └─────────────────┘
```

### Frontend 3D Stack

| Component | Library | Purpose |
|-----------|---------|---------|
| ProductViewer3D | React Three Fiber | Interactive 3D product rotate |
| AvatarRenderer | R3F + Ready Player Me | Animated avatar with clothing |
| TryOnCamera | MediaPipe + Canvas | Body detection from photo |
| ClothSimulation | Three.js + Cannon.js | Realistic fabric physics |

### Avatar Features

- **Models:** Ready Player Me GLB avatars (male, female, child)
- **Body types:** Slim, average, athletic, plus-size
- **Skin tones:** 6 Fitzpatrick scale options
- **Animations:** Idle stand, walk cycle, dance, T-pose, spin (Mixamo)
- **Clothing mapping:** UV-mapped product design onto avatar mesh
- **Performance:** LOD system (high/med/low poly based on device)

### Virtual Try-On Flow

```
1. User uploads selfie
2. MediaPipe detects body landmarks (33 keypoints)
3. Segment body from background (BodyPix / SAM)
4. Estimate body measurements from landmarks
5. Select closest avatar body type
6. Map product design onto avatar
7. Render composite: user face + avatar body + product
8. Display side-by-side comparison with slider
```

### Performance Budget (Low-End Android)

- 3D model max: 500KB GLB (draco compressed)
- Texture max: 512x512 (mobile), 2048x2048 (desktop)
- Target: 30fps on Snapdragon 665 equivalent
- Fallback: 2D mockup images when WebGL unavailable

---

## 13. Media Pipeline

### Image Processing Flow

```
Upload (max 25MB)
  │
  ├── Validate (type, size, dimensions)
  │
  ├── Store original in S3 (private bucket)
  │
  ├── Queue processing:
  │   ├── Generate thumbnail (300x300 WebP, q80)
  │   ├── Generate medium (800x800 WebP, q85)
  │   ├── Generate large (1600x1600 WebP, q90)
  │   ├── Generate OG image (1200x630 WebP, q85)
  │   └── Optional: AI background removal
  │
  ├── Store processed in S3 (public bucket)
  │
  └── Return CDN URLs for all variants
```

### Video/Animation Pipeline

```
Design + Product Model
  │
  ├── Blender headless render (Docker worker)
  │   ├── 360° turntable (15s, 720p)
  │   ├── Avatar wearing product (5s loop)
  │   └── Product detail zoom (10s)
  │
  ├── FFmpeg post-process
  │   ├── H.264 MP4 (web)
  │   ├── WebM VP9 (modern browsers)
  │   └── GIF preview (5s, 480p)
  │
  └── Upload to S3 + CDN
```

### Service Stack

| Tool | Purpose | Cost Tier |
|------|---------|-----------|
| Cloudinary | On-the-fly transforms, responsive images | Free tier 25K/mo |
| AWS S3 | Origin storage | ~$0.023/GB |
| CloudFront | CDN delivery (BD PoP: Mumbai/Singapore) | ~$0.085/GB |
| Sharp (Node) | Server-side image resize | Free (OSS) |
| FFmpeg | Video encoding | Free (OSS) |
| Blender (headless) | 3D rendering | Free (OSS, needs GPU worker) |

---

## 14. Fulfillment Logic

### Order Status Machine

```
PENDING ──> PAID ──> PROCESSING ──> PRINTED ──> SHIPPED ──> DELIVERED
   │          │          │                          │
   └── CANCELLED    FAILED                     RETURNED
```

### Courier Integration

| Courier | Region | API Type | Features |
|---------|--------|----------|----------|
| Pathao Courier | BD (urban) | REST | Real-time tracking, COD |
| RedX | BD (nationwide) | REST | Bulk shipping, COD |
| Steadfast | BD | REST | SMS notifications |
| eCourier | BD | REST | Same-day delivery (Dhaka) |
| DHL | International | REST | Global tracking |
| FedEx | International | REST/SOAP | Express shipping |

### Fulfillment Flow

```
1. Order marked PAID
2. Fulfillment service receives order.paid event
3. Determine fulfillment type:
   a. Platform print-on-demand: queue to print facility
   b. Creator self-fulfillment: notify creator
4. Generate shipping label via courier API
5. Assign tracking number
6. Update order: PROCESSING -> PRINTED -> SHIPPED
7. Sync tracking status via webhook/polling
8. Auto-mark DELIVERED after courier confirmation
9. Release creator funds (if held until delivery)
```

---

## 15. AI Features

### MVP AI Features (Phase 2)

| Feature | Implementation | API |
|---------|---------------|-----|
| Background Removal | rembg (local) or Remove.bg API | POST /ai/remove-bg |
| Image Upscale | Real-ESRGAN (local) | POST /ai/upscale |
| Product Title Gen | GPT-4 API | POST /ai/generate-title |
| SEO Description | GPT-4 API | POST /ai/generate-seo |
| Auto Tags | CLIP model | POST /ai/auto-tag |

### Advanced AI Features (Phase 3+)

| Feature | Implementation | API |
|---------|---------------|-----|
| Design Generation | Stable Diffusion / DALL-E | POST /ai/generate-design |
| Smart Pricing | ML model (historical data) | GET /ai/suggest-price |
| Trend Prediction | Time-series analysis | GET /ai/trends |
| Body Estimation | MediaPipe + custom model | POST /ai/body-detect |
| Style Transfer | Neural style transfer | POST /ai/style-transfer |

### AI Credit System

| Plan | Monthly Credits | Overage Rate |
|------|----------------|--------------|
| Free | 10 | Not available |
| Pro | 100 | 5 BDT/credit |
| Brand | 500 | 3 BDT/credit |
| Enterprise | Unlimited | — |

---

## 16. Security & Scalability

### Security Measures

| Layer | Measure | Implementation |
|-------|---------|---------------|
| Auth | JWT + Refresh tokens | 15min access / 7day refresh, httpOnly cookies |
| Auth | Rate limiting | 100 req/min login, 1000 req/min general |
| Auth | RBAC | USER, CREATOR, ADMIN roles with guards |
| Data | Input validation | Zod schemas on all endpoints |
| Data | SQL injection | Prisma parameterized queries |
| Data | XSS | React auto-escaping + CSP headers |
| Files | Upload validation | File type, size, magic bytes check |
| Files | Malware scan | ClamAV on upload queue |
| Payment | Webhook verification | HMAC signature on all gateway webhooks |
| Payment | Idempotency | Idempotency keys on all mutations |
| Payment | PCI compliance | Never store card data (use Stripe Elements / gateway tokens) |
| Infra | Encryption at rest | AES-256 (S3, RDS) |
| Infra | Encryption in transit | TLS 1.3 everywhere |
| Infra | DDoS protection | Cloudflare proxy |
| Audit | Logging | All admin actions + payment events logged |
| Fraud | Detection | Velocity checks, unusual pattern alerts |

### Scalability Architecture

```
                    CloudFront CDN
                         │
                    ┌────▼─────┐
                    │ ALB      │  (Application Load Balancer)
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐
         │ Web x3 │ │ API x5 │ │ Worker │
         │ (Next) │ │ (Nest) │ │ x3     │
         └────────┘ └───┬────┘ └────────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
         ┌────▼───┐ ┌──▼────┐ ┌─▼──────┐
         │ PG RDS │ │ Redis │ │ RabbitMQ│
         │ r/w    │ │ cluster│ │ cluster │
         │ split  │ │       │ │        │
         └────────┘ └───────┘ └────────┘
```

### Scaling Milestones

| Users | Infra Changes |
|-------|--------------|
| 0-1K | Single server (VPS), managed PostgreSQL |
| 1K-10K | Add Redis, separate API/Web, CDN |
| 10K-50K | Kubernetes, read replicas, Elasticsearch |
| 50K-100K | Multi-AZ, queue scaling, dedicated render workers |
| 100K-1M | Microservices, database sharding, global CDN |

---

## 17. Business Model

### Revenue Streams

| Stream | Description | Est. % of Revenue |
|--------|------------|-------------------|
| Commission | 20% on each sale | 60% |
| Subscriptions | Pro/Brand/Enterprise plans | 20% |
| Featured Products | Promoted placement in marketplace | 8% |
| AI Credits | Pay-per-use AI features | 7% |
| Premium Themes | Store customization themes | 3% |
| Ad Placements | Banner ads from brands | 2% |

### Subscription Plans

| Feature | Free | Pro (499 BDT/mo) | Brand (1499 BDT/mo) | Enterprise (Custom) |
|---------|------|-------------------|---------------------|---------------------|
| Products | 5 | 50 | Unlimited | Unlimited |
| Storage | 100MB | 5GB | 50GB | Unlimited |
| AI Credits | 10/mo | 100/mo | 500/mo | Unlimited |
| Commission | 25% | 15% | 10% | Negotiable |
| Custom Domain | No | Yes | Yes | Yes |
| Team Members | 1 | 3 | 10 | Unlimited |
| Analytics | Basic | Advanced | Premium | Custom |
| Priority Support | No | Email | Chat + Email | Dedicated |
| API Access | No | Read | Full | Full + Webhooks |
| Store Themes | 1 | 5 | All | Custom |

---

## 18. MVP Roadmap (Phase 1 — 8 weeks)

### Week 1-2: Foundation
- [x] Monorepo setup (Turborepo)
- [ ] Next.js 15 project with Tailwind + design tokens
- [ ] NestJS project with Prisma + PostgreSQL
- [ ] Auth system (register, login, JWT)
- [ ] User profile CRUD
- [ ] Docker Compose for local dev

### Week 3-4: Core Product
- [ ] Product CRUD (create, edit, list, detail)
- [ ] Image upload + optimization pipeline
- [ ] Product variants (size, color)
- [ ] Marketplace page with search/filter
- [ ] Product detail page with gallery
- [ ] Creator dashboard layout

### Week 5-6: Commerce
- [ ] Cart system
- [ ] Checkout flow
- [ ] bKash payment integration
- [ ] Nagad payment integration
- [ ] Stripe payment integration (international)
- [ ] Order management (create, track)
- [ ] Commission split logic

### Week 7-8: Launch Prep
- [ ] Creator storefront pages
- [ ] Shareable product links
- [ ] Email notifications (Resend)
- [ ] Basic analytics (views, sales)
- [ ] SEO optimization (meta tags, sitemap, ISR)
- [ ] Mobile responsiveness pass
- [ ] Performance optimization (< 3s LCP on 3G)
- [ ] Security audit
- [ ] Staging deploy

---

## 19. V2 Roadmap

### Phase 2 (Weeks 9-16): Design Studio + AI
- Design studio (Fabric.js canvas)
- Layer management, text tools, stickers
- AI background removal
- AI product title/description generation
- Product mockup generation
- SSLCommerz + Rocket payment
- Affiliate link system
- Advanced analytics dashboard
- Review system

### Phase 3 (Weeks 17-24): 3D + Try-On
- 3D product viewer (React Three Fiber)
- Avatar system (Ready Player Me)
- Clothing try-on with photo upload
- Avatar animations (walk, dance, pose)
- Body type / skin color customization
- AR preview (mobile camera)
- Subscription billing system
- Multi-language (Bangla + English)

### Phase 4 (Weeks 25-32): Scale
- Marketplace ranking algorithm
- Full-text search (Elasticsearch)
- Fulfillment courier integrations (Pathao, RedX)
- International shipping (DHL, FedEx)
- Admin panel (user/product moderation)
- Support ticket system
- Ad placement system
- Platform API for external integrations
- Kubernetes migration
- Load testing + optimization

---

## 20. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| bKash API instability | Payment failures | Medium | Fallback to SSLCommerz, retry queue |
| Low-end device performance | Bad UX for 60% of users | High | Progressive enhancement, 2D fallback for 3D |
| Slow BD internet (avg 10Mbps) | High bounce rate | High | < 1MB JS bundle, ISR, CDN, image compression |
| Payment fraud (fake bKash) | Revenue loss | Medium | Webhook verification, manual review queue |
| Design IP theft | Legal issues | Medium | Watermarks, DMCA process, image fingerprinting |
| Server costs with 3D rendering | Budget overrun | Medium | Queue-based, render on demand, cache aggressively |
| Competitor launch | Market share | Low | First-mover in BD, local payment advantage |
| Regulatory (BD e-commerce law) | Compliance | Low | Legal counsel, terms of service, tax collection |

---

## 21. Scaling Plan: 100 Users to 1 Million

| Stage | Users | Infrastructure | Monthly Cost Est. |
|-------|-------|---------------|------------------|
| Seed | 100 | 1 VPS (4GB), managed PG, S3 | $50 |
| Early | 1K | 2 VPS, Redis, CDN | $150 |
| Growth | 10K | K8s (3 nodes), RDS, ElastiCache | $800 |
| Scale | 50K | K8s (8 nodes), read replicas, dedicated workers | $3,000 |
| Mature | 100K | Multi-AZ K8s, Aurora, dedicated render GPU | $8,000 |
| Mass | 500K | Global CDN, sharded DB, edge workers | $20,000 |
| Target | 1M | Full microservices, multi-region, auto-scale | $40,000 |

---

## 22. Third-Party Services

| Category | Service | Purpose | Cost |
|----------|---------|---------|------|
| Payments | bKash Merchant | BD mobile payments | 1.5% per txn |
| Payments | Nagad Merchant | BD mobile payments | 1.5% per txn |
| Payments | SSLCommerz | BD card + multi-method | 2% per txn |
| Payments | Stripe | International cards | 2.9% + 30¢ |
| Payments | PayPal | International | 3.49% + 49¢ |
| Email | Resend | Transactional email | Free up to 3K/mo |
| SMS | BulkSMS BD | BD SMS notifications | ~0.25 BDT/SMS |
| Storage | AWS S3 | File storage | $0.023/GB |
| CDN | CloudFront | Asset delivery | $0.085/GB |
| Media | Cloudinary | Image transforms | Free 25K/mo |
| Search | Elasticsearch (AWS) | Product search | $50/mo starter |
| AI | OpenAI API | Text generation | Pay per token |
| AI | Remove.bg | Background removal | $0.20/image |
| 3D | Ready Player Me | Avatar models | Free tier |
| Courier | Pathao API | BD delivery | Per-parcel |
| Courier | RedX API | BD delivery | Per-parcel |
| Auth | Google OAuth | Social login | Free |
| Monitoring | Sentry | Error tracking | Free tier |
| Analytics | Mixpanel / PostHog | Product analytics | Free tier |

---

## 23. TypeScript Interfaces

See `packages/shared/src/types/` for complete type definitions. Key interfaces:

```typescript
// User
interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  country: string;
  language: 'en' | 'bn';
  role: 'USER' | 'CREATOR' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
}

// Product
interface Product {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  description?: string;
  productType: ProductType;
  basePrice: number;
  sellingPrice: number;
  profitMargin: number;
  currency: Currency;
  status: ProductStatus;
  tags: string[];
  variants: ProductVariant[];
  designs: ProductDesign[];
  mockupUrls: MockupUrls;
  viewCount: number;
  saleCount: number;
  rating?: number;
  createdAt: Date;
}

// Order
interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: Currency;
  shippingAddress: Address;
  trackingNumber?: string;
  courier?: string;
  createdAt: Date;
}
```

---

## 24. Example API Contracts

### Create Product

```http
POST /api/v1/products
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "title": "Dhaka Nights Graphic Tee",
  "description": "Premium cotton tee featuring the Dhaka skyline",
  "productType": "TSHIRT",
  "basePrice": 500,
  "sellingPrice": 850,
  "currency": "BDT",
  "tags": ["dhaka", "skyline", "graphic-tee"],
  "variants": [
    { "size": "S", "color": "Black", "colorHex": "#000000" },
    { "size": "M", "color": "Black", "colorHex": "#000000" },
    { "size": "L", "color": "Black", "colorHex": "#000000" },
    { "size": "XL", "color": "White", "colorHex": "#FFFFFF" }
  ]
}
```

**Response (201):**
```json
{
  "id": "prod_abc123",
  "slug": "dhaka-nights-graphic-tee",
  "shareableLink": "https://bengalstitch.com/p/dhaka-nights-graphic-tee",
  "status": "DRAFT",
  "createdAt": "2026-04-04T10:00:00Z"
}
```

### Initiate Payment

```http
POST /api/v1/payments/initiate
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "orderId": "ord_xyz789",
  "gateway": "BKASH",
  "returnUrl": "https://bengalstitch.com/checkout/success"
}
```

**Response (200):**
```json
{
  "paymentId": "pay_def456",
  "gateway": "BKASH",
  "redirectUrl": "https://payment.bkash.com/checkout/...",
  "expiresAt": "2026-04-04T10:15:00Z"
}
```

---

## 25. Development Timeline

| Phase | Duration | Team Size | Deliverables |
|-------|----------|-----------|-------------|
| **Phase 1: MVP** | 8 weeks | 2 FE + 2 BE + 1 Design | Auth, Products, Marketplace, Checkout, BD Payments |
| **Phase 2: Studio** | 8 weeks | 2 FE + 2 BE + 1 AI | Design Editor, Mockups, AI Tools, Affiliates |
| **Phase 3: 3D** | 8 weeks | 2 FE (3D) + 1 BE + 1 AI | Avatars, Try-On, Animations, Subscriptions |
| **Phase 4: Scale** | 8 weeks | 2 FE + 2 BE + 1 DevOps | Search, Fulfillment, Admin, K8s, International |
| **Total** | **32 weeks** | **~6-8 engineers** | **Full Platform** |

### Suggested Sprint Cadence
- 2-week sprints
- Monday planning, Friday demo
- Daily standups (15min)
- Bi-weekly design review
- Monthly architecture review

---

*This blueprint is a living document. Update as decisions are made and requirements evolve.*

*Generated for BengalStitch — April 2026*
