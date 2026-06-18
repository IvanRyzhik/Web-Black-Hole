import { describe, expect, it } from 'vitest';
import { isEmptyRegion } from '@/game/Decomposer/EmptyRegionDetector';

describe('EmptyRegionDetector', () => {
  it('treats mostly white regions as empty', () => {
    const pixels = new Uint8ClampedArray(16 * 16 * 4).fill(255);
    expect(
      isEmptyRegion({
        width: 16,
        height: 16,
        pixels,
      }),
    ).toBe(true);
  });

  it('keeps colorful regions', () => {
    const pixels = new Uint8ClampedArray(16 * 16 * 4);
    for (let index = 0; index < pixels.length; index += 4) {
      pixels[index] = 120;
      pixels[index + 1] = 40;
      pixels[index + 2] = 200;
      pixels[index + 3] = 255;
    }

    expect(
      isEmptyRegion({
        width: 16,
        height: 16,
        pixels,
      }),
    ).toBe(false);
  });
});
