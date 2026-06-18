import { describe, expect, it } from 'vitest';
import { Hole } from '@/game/Hole';

describe('Hole', () => {
  it('levels up when enough elements are consumed', () => {
    const hole = new Hole();
    hole.initialize(100, 100, 100);

    expect(hole.getState().level).toBe(1);
    expect(hole.consume(10)).toBe(true);
    expect(hole.getState().level).toBe(2);
    expect(hole.consume(90)).toBe(true);
    expect(hole.getState().level).toBe(10);
  });

  it('grows radius with level', () => {
    const hole = new Hole();
    hole.initialize(100, 0, 0);
    const initialRadius = hole.getRadius();
    hole.consume(100);
    expect(hole.getRadius()).toBeGreaterThan(initialRadius);
  });
});
