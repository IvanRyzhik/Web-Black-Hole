# Black Hole

Play a black-hole arcade game on top of any webpage. Page content becomes physical shapes you can consume, and the hole grows through 10 size levels.

**Repository:** https://github.com/IvanRyzhik/Web-Black-Hole

## Features

- Overlay game on any site without leaving the page
- DOM-aware decomposers: text, buttons, images, empty regions skipped
- 10-level growth curve based on total spawned elements
- Semi-transparent gameplay layer with in-game opacity slider
- Popup controls for play/stop and audio settings
- Audio slots ready for background music and consume SFX

## Tech stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Extension | Chrome Manifest V3, TypeScript             |
| Build     | Vite, `@crxjs/vite-plugin`                 |
| Rendering | Three.js                                   |
| Physics   | Matter.js (2D attraction + 3D visuals)     |
| Tests     | Vitest, jsdom, `@webext-core/fake-browser` |
| Quality   | ESLint, Prettier, Husky, GitHub Actions    |

## Getting started

```bash
npm install
npm run dev
```

Then open `chrome://extensions`, enable Developer mode, and load the unpacked `dist` folder.

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start Vite dev build          |
| `npm run build`     | Typecheck and build extension |
| `npm test`          | Run Vitest in watch mode      |
| `npm run test:ci`   | Run tests with coverage       |
| `npm run verify`    | Same checks as CI             |
| `npm run verify:ci` | `npm ci` + verify (pre-push)  |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | TypeScript                    |
| `npm run package`   | Build and zip extension       |

## Usage

1. Open any webpage
2. Click the extension icon
3. Press **Play**
4. Move the hole with mouse or `WASD`
5. Adjust opacity from the in-game HUD
6. Press **Exit** or `Escape` to stop

## Project structure

```text
src/
  background/   service worker and tab state
  content/      content script entry
  popup/        extension popup UI
  game/         game engine, physics, decomposers
  shared/       settings and messaging
tests/          unit and integration tests
docs/           architecture and development notes
```

## Documentation

- [Handoff / next steps](docs/HANDOFF.md) — start here when continuing development
- [Architecture](docs/architecture.md)
- [Development guide](docs/development.md)

## Roadmap

- Real audio assets
- More decomposer strategies
- Playwright end-to-end tests
- Chrome Web Store release

## License

MIT
