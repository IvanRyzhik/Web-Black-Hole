import type { SpawnedElement } from '@/game/Decomposer/types';

const TILE_SIZE_PX = 16;

export function decomposeImage(element: HTMLElement, idPrefix: string): SpawnedElement[] {
  const rect = element.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) {
    return [];
  }

  const cols = Math.max(1, Math.ceil(rect.width / TILE_SIZE_PX));
  const rows = Math.max(1, Math.ceil(rect.height / TILE_SIZE_PX));
  const tileWidth = rect.width / cols;
  const tileHeight = rect.height / rows;
  const elements: SpawnedElement[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      elements.push({
        id: `${idPrefix}-tile-${row}-${col}`,
        kind: 'image',
        shape: 'cube',
        x: rect.left + col * tileWidth + tileWidth / 2,
        y: rect.top + row * tileHeight + tileHeight / 2,
        width: tileWidth,
        height: tileHeight,
        mass: 1,
      });
    }
  }

  return elements;
}
