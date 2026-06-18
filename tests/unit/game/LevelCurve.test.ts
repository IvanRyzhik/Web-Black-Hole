import { describe, expect, it } from 'vitest';
import {
  buildLevelThresholds,
  getLevelFromConsumed,
  getProgressToNextLevel,
} from '@/game/LevelCurve';

describe('LevelCurve', () => {
  it('builds linear cumulative thresholds', () => {
    expect(buildLevelThresholds(100)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  it('returns zero thresholds for empty pages', () => {
    expect(buildLevelThresholds(0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('maps consumed count to level', () => {
    const thresholds = buildLevelThresholds(100);
    expect(getLevelFromConsumed(0, thresholds)).toBe(1);
    expect(getLevelFromConsumed(10, thresholds)).toBe(2);
    expect(getLevelFromConsumed(55, thresholds)).toBe(6);
    expect(getLevelFromConsumed(100, thresholds)).toBe(10);
  });

  it('calculates progress within the current level', () => {
    const thresholds = buildLevelThresholds(100);
    expect(getProgressToNextLevel(5, 1, thresholds)).toBeCloseTo(0.5);
    expect(getProgressToNextLevel(15, 2, thresholds)).toBeCloseTo(0.5);
    expect(getProgressToNextLevel(100, 10, thresholds)).toBe(1);
  });
});
