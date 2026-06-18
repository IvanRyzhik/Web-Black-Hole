# Development

## Local workflow

```bash
npm install
npm run dev
```

Load `dist/` as an unpacked extension after the first build.

## Debugging

- Popup: right click extension icon → Inspect popup
- Background worker: `chrome://extensions` → Service worker
- Content script: DevTools on the target page → Sources → Content scripts

## Adding a decomposer

1. Create a file in `src/game/Decomposer/`
2. Export a function that returns `SpawnedElement[]`
3. Register it in `classifyElement.ts` or `DecomposerRegistry.ts`
4. Add tests under `tests/unit/decomposer/` or `tests/integration/`

## Audio files

Add optional assets to `public/audio/`:

- `bgm.mp3`
- `consume.mp3`

No code changes are required beyond placing the files.

## Common issues

- Cross-origin images may not rasterize cleanly in future screenshot fallback mode
- Heavy pages are capped by `MAX_ELEMENTS`
- Audio autoplay requires a user gesture such as clicking Play in the popup
