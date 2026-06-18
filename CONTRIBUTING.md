# Contributing

Thanks for your interest in Black Hole.

## Setup

```bash
npm install
```

## Before opening a PR

```bash
npm run lint
npm run format
npm run typecheck
npm run test:ci
npm run build
```

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
