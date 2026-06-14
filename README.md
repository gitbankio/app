# gitbank/app

React frontend for Gitbank. Onboarding UI and vault monitoring dashboard.

## Structure

```
web/            React 19 + Vite 7 frontend
api-client/     Generated React Query hooks from OpenAPI spec
```

## UI scope

The UI is intentionally limited to:
- **Onboarding** - GitHub OAuth, one-time vault deployment
- **Monitoring** - vault balances, transaction history, project progress, connected repos

All vault and bounty operations happen via `@gitbankbot` mentions in GitHub. There are no action buttons for operations that should be bot commands.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Install

```bash
pnpm install
```

## Run (development)

```bash
pnpm --filter @workspace/gitbank run dev
```

## Environment variables

The frontend connects to the API server. Set the API base URL if running separately:

```env
VITE_API_BASE_URL=    # defaults to /api (same-origin)
```

## API client codegen

The `api-client/` package contains generated React Query hooks. Do not edit files
in `api-client/src/generated/` directly. Regenerate from the OpenAPI spec:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
