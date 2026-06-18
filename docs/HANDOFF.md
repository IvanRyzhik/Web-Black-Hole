# Handoff — продовження розробки

> Останнє оновлення: 2026-06-18  
> Репозиторій: https://github.com/IvanRyzhik/Web-Black-Hole  
> Гілка: `main`  
> Версія: `0.1.0` (scaffold / MVP skeleton)

Цей файл — стартова точка для нового чату з Cursor. Прочитай його першим.

---

## Що вже зроблено (Етап 0 — scaffold)

### Інфраструктура
- [x] Vite + `@crxjs/vite-plugin` + TypeScript strict
- [x] ESLint 9, Prettier, Husky, lint-staged
- [x] GitHub Actions CI (lint, format, typecheck, test, build)
- [x] Репозиторій на GitHub, initial commit `282e58c`
- [x] Локальний git credential **тільки для цього репо** → акаунт `IvanRyzhik` (глобально активний залишається `CodeITIvan-Ryzhyk`)

### Extension (MV3)
- [x] `popup` — Play/Stop, аудіо toggle/volume
- [x] `background` — tab state, messaging
- [x] `content` — ін'єкція гри, Escape для виходу

### Гра (skeleton, працює базово)
- [x] `GameEngine` — цикл, spawn, consume, teardown
- [x] `SceneManager` — Three.js ortho, кубики/піраміди/шари, opacity
- [x] `PhysicsWorld` — Matter.js, притягання, поглинання
- [x] `Hole` + `LevelCurve` — 10 рівнів, рівномірна крива (10% на рівень)
- [x] `InputController` — mouse + WASD
- [x] `HUD` — opacity slider, Size N, лічильник, Exit
- [x] `AudioManager` — API-заглушки (файлів ще немає)

### Decomposer (базовий MVP)
- [x] `DecomposerRegistry` + класифікація DOM
- [x] `EmptyRegionDetector` — skip білого (лише для `unknown`)
- [x] `ButtonDecomposer` → шари
- [x] `TextDecomposer` → піраміди (fallback позицій у jsdom)
- [x] `ImageDecomposer` → тайли 16×16 px
- [ ] `html2canvas` fallback — **не реалізовано** (`CaptureService` — порожня заглушка)

### Тести
- [x] 18 тестів, coverage ~77% на core modules
- [x] Unit: LevelCurve, Hole, settings, classifyElement, EmptyRegionDetector, clamp, messaging
- [x] Integration: DecomposerRegistry + HTML fixture

### Документація
- [x] README, CONTRIBUTING, CHANGELOG, LICENSE
- [x] `docs/architecture.md`, `docs/development.md`
- [ ] Demo GIF для README — **немає**
- [ ] `docs/assets/demo.gif` — **немає**

---

## Що працює зараз (ручна перевірка)

```bash
npm install
npm run dev
# chrome://extensions → Load unpacked → dist/
```

1. Відкрити будь-яку сторінку → іконка extension → **Play**
2. Контент сторінки перетворюється на фігури (кольорові placeholder-меші)
3. Керування дірою мишкою / WASD
4. HUD: opacity, Size, лічильник, Exit
5. Escape або Exit — повне прибирання overlay

### Відомі обмеження MVP
- Текстури з реального контенту сторінки **не** накладаються (лише кольори за типом)
- Progress ring на дірі — **не** реалізований
- Анімація падіння при поглинанні — **мінімальна** (remove mesh)
- `popup` Stop може не синхронізуватись ідеально з content (перевірити messaging)
- Three.js bundle ~612 KB — потрібен code-split пізніше
- Аудіофайли: покласти в `public/audio/bgm.mp3`, `consume.mp3`

---

## Наступні кроки (пріоритет)

### Етап 1 — Core Game Loop polish (наступний чат)
1. **Progress ring** на ободі діри (`SceneManager.renderHole` — параметр `_progress` вже є)
2. **Синхронізація mesh ↔ physics** кожен кадр для всіх тіл (зараз частково)
3. **Анімація поглинання** — scale↓ + translate↓ перед remove
4. **Hole visual** — shader / кращий обідок як на референсі Hole.io
5. Перевірити `canConsume` vs `getConsumableIds` (різна логіка розміру)

### Етап 2 — Decomposer + текстури
1. Текстури з DOM: букви, кнопки, фрагменти картинок на `CanvasTexture`
2. `html2canvas` fallback у `CaptureService`
3. Ліміт `MAX_ELEMENTS` (500) + зменшення деталізації на важких сторінках
4. Нові decomposer-сценарії (за бажанням): списки, SVG, таблиці

### Етап 3 — Polish + portfolio
1. Demo GIF → `docs/assets/demo.gif` + README hero
2. Аудіофайли від автора → `public/audio/`
3. `InstancedMesh` / object pooling для performance
4. Playwright E2E (опційно)

### Етап 4 — Release
1. Chrome Web Store listing
2. Coverage badge у README
3. GitHub Release zip (`npm run package`)

---

## Ключові файли

| Файл | Призначення |
|------|-------------|
| `src/game/GameEngine.ts` | Головний цикл гри |
| `src/game/SceneManager.ts` | Three.js рендер |
| `src/game/PhysicsWorld.ts` | Matter.js |
| `src/game/Hole.ts` | Рівні, радіус, consume |
| `src/game/LevelCurve.ts` | Лінійні пороги 10% |
| `src/game/Decomposer/DecomposerRegistry.ts` | Spawn pipeline |
| `src/game/constants.ts` | MAX_ELEMENTS, радіуси рівнів |
| `manifest.config.ts` | MV3 manifest |

---

## Git / GitHub (важливо)

- **Remote:** `https://github.com/IvanRyzhik/Web-Black-Hole.git`
- **Push цього репо:** використовує токен `IvanRyzhik` через локальний credential helper
- **Інші репо:** не чіпати — глобально активний `CodeITIvan-Ryzhyk`
- Перевірка: `gh auth status`

```bash
# Push після змін у цьому проєкті
git add -A && git commit -m "..." && git push
```

---

## Команди якості (перед PR / push)

```bash
npm run lint
npm run format
npm run typecheck
npm run test:ci
npm run build
```

---

## Контекст для нового чату

Скопіюй у новий чат:

```
Продовжуємо Black Hole Chrome extension.
Репо: https://github.com/IvanRyzhik/Web-Black-Hole
Прочитай docs/HANDOFF.md і почни з Етапу 1 (game loop polish).
```

Повний план також у `.cursor/plans/` (якщо є в workspace).

---

## Дизайн-рішення (не змінювати без причини)

- **Гібрид:** 3D візуал (Three.js) + 2D фізика (Matter.js)
- **10 рівнів діри:** рівномірно, `floor(consumed / (total/10)) + 1`
- **Opacity:** тільки в HUD, зберігається в `chrome.storage`
- **Аудіо:** заглушки, файли додасть автор
- **Decomposer:** strategy registry, нові типи — окремі файли
