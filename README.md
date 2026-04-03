# BengalStitch

**Design Globally, Sell Locally** — A Bangladesh-focused print-on-demand marketplace.

## Quick Start

### Prerequisites
- Node.js 22+
- Docker & Docker Compose
- npm 10+

### 1. Clone and install

```bash
npm install
```

### 2. Start infrastructure

```bash
npm run docker:up
```

This starts PostgreSQL, Redis, RabbitMQ, and Elasticsearch.

### 3. Set up environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Run database migrations

```bash
cd apps/api
npx prisma migrate dev --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma
```

### 5. Start development

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **RabbitMQ UI:** http://localhost:15672

## Project Structure

```
bengalstitch/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types, constants, validators
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configs
├── docker/           # Docker Compose
├── infra/            # Terraform / K8s
├── stitch/           # Design assets (Stitch export)
└── BLUEPRINT.md      # Full technical specification
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | NestJS 11, Prisma 6, PostgreSQL 16 |
| State | Zustand, TanStack Query |
| 3D | React Three Fiber, Three.js |
| Payments | bKash, Nagad, SSLCommerz, Stripe, PayPal |
| Infrastructure | Docker, Kubernetes, AWS |

## Documentation

See [BLUEPRINT.md](./BLUEPRINT.md) for the complete technical specification including:
- System architecture
- Database schema (20+ tables)
- API endpoints (60+ routes)
- Frontend component hierarchy
- Payment integration flows
- 3D/Avatar pipeline
- Deployment strategy
- MVP roadmap

## License

Proprietary — All rights reserved.
