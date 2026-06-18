import type { SpawnedElement } from '@/game/Decomposer/types';

export function decomposeButton(element: HTMLElement, idPrefix: string): SpawnedElement[] {
  const rect = element.getBoundingClientRect();
  const layerCount = 3;

  return Array.from({ length: layerCount }, (_, index) => ({
    id: `${idPrefix}-layer-${index}`,
    kind: 'button' as const,
    shape: 'layer' as const,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: rect.width,
    height: Math.max(2, rect.height / layerCount),
    mass: 1,
  }));
}
