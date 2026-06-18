import { LEVEL_COUNT } from '@/game/constants';

export function buildLevelThresholds(totalElements: number): number[] {
  if (totalElements <= 0) {
    return Array.from({ length: LEVEL_COUNT }, () => 0);
  }

  return Array.from({ length: LEVEL_COUNT }, (_, index) => {
    const level = index + 1;
    return Math.ceil((totalElements * level) / LEVEL_COUNT);
  });
}

function getStepSize(thresholds: readonly number[]): number {
  const total = thresholds[thresholds.length - 1] ?? 0;
  if (total <= 0) {
    return 1;
  }

  return total / LEVEL_COUNT;
}

export function getLevelFromConsumed(
  consumed: number,
  thresholds: readonly number[],
): number {
  if (consumed <= 0 || thresholds.length === 0) {
    return 1;
  }

  const step = getStepSize(thresholds);
  if (step <= 0) {
    return 1;
  }

  return Math.min(LEVEL_COUNT, Math.floor(consumed / step) + 1);
}

export function getProgressToNextLevel(
  consumed: number,
  currentLevel: number,
  thresholds: readonly number[],
): number {
  if (currentLevel >= LEVEL_COUNT) {
    return 1;
  }

  const step = getStepSize(thresholds);
  const levelStart = (currentLevel - 1) * step;
  const levelEnd = currentLevel * step;

  if (levelEnd <= levelStart) {
    return 1;
  }

  return Math.min(1, Math.max(0, (consumed - levelStart) / (levelEnd - levelStart)));
}
