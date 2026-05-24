# Contributing to gitbank/app

Thanks for your interest in contributing.

## Before you start

- Open an issue first for non-trivial changes
- For bugs, include steps to reproduce and expected vs actual behavior

## Development setup

```bash
pnpm install
pnpm --filter @workspace/gitbank run dev
```

## Conventions

### UI scope

The web UI is intentionally limited to onboarding and monitoring. Do not add UI for operations that should be bot commands. All vault, project, and bounty actions happen via `@gitbankbot` mentions in GitHub.

### API client

Do not edit files in `api-client/src/generated/` directly. They are generated from the OpenAPI spec in `gitbank/server`.

### Styling

- Tailwind v4 utility classes only - no inline styles
- Framer Motion for animations
- Follow existing component patterns in `web/src/components/`

## Type checking

```bash
pnpm run typecheck
```

Must pass with zero errors before opening a PR.

## Pull requests

- One concern per PR
- Clear description of what changed and why
- Reference related issues with `Closes #<number>`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
