# Contributing

Thanks for your interest in Black Hole.

## Setup

```bash
npm install
```

## Before opening a PR

```bash
nvm use          # Node 22 — same as CI
npm run verify:ci
```

`verify:ci` runs `npm ci` + the same checks as GitHub Actions (`lint`, `format`, `typecheck`, `test:ci`, `build`).

For day-to-day work after dependencies are installed:

```bash
npm run verify
```

`git push` also runs `npm run verify` via Husky pre-push hook.

## Commit style

Use Conventional Commits:

- `feat: add table decomposer`
- `fix: clamp hole position on resize`
- `test: cover empty region detector`

## PR checklist

- [ ] Tests added or updated for behavior changes
- [ ] `npm run test:ci` passes
- [ ] `npm run build` passes
- [ ] README or docs updated if behavior or setup changed
