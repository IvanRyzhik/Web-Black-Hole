import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { DecomposerRegistry } from '@/game/Decomposer/DecomposerRegistry';

function mockLayout(element: Element): void {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.getBoundingClientRect = () =>
    ({
      x: 10,
      y: 10,
      width: 120,
      height: 40,
      top: 10,
      left: 10,
      right: 130,
      bottom: 50,
      toJSON: () => ({}),
    }) as DOMRect;

  for (const child of element.querySelectorAll('*')) {
    mockLayout(child);
  }
}

describe('DecomposerRegistry', () => {
  beforeEach(() => {
    const html = readFileSync(
      resolve(process.cwd(), 'tests/fixtures/sample-page.html'),
      'utf8',
    );
    document.documentElement.innerHTML = html;
    mockLayout(document.body);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  });

  it('spawns elements for mixed page content', () => {
    const registry = new DecomposerRegistry();
    const result = registry.decompose(document.body);

    expect(result.totalElements).toBeGreaterThan(0);
    expect(result.elements.some((element) => element.kind === 'button')).toBe(true);
    expect(result.elements.some((element) => element.kind === 'text')).toBe(true);
    expect(result.elements.some((element) => element.kind === 'image')).toBe(true);
  });
});
