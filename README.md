# Kuxmate

Modern, open-source forum and community platform built for performance, extensibility, and self-hosting.

## Status

This repository currently contains the engineering foundation only. Product features are intentionally not implemented yet.

## Requirements

- Node.js 22.12 or newer
- pnpm 12.5.1, supplied through Corepack

## Development

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm check
pnpm build
```

Run both application processes during development:

```bash
pnpm dev
```

The web application runs on `http://localhost:3000`. The API runs on `http://localhost:4000`; its operational liveness endpoint is `GET /health/live`.

Architecture and engineering conventions are recorded in [`docs/engineering-foundation.md`](docs/engineering-foundation.md).
