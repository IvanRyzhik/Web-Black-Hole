import {
  HOLE_CONSUME_SIZE_FACTOR,
  HOLE_INFLUENCE_MULTIPLIER,
  HOLE_LEVEL_RADIUS,
  LEVEL_COUNT,
} from '@/game/constants';
import {
  buildLevelThresholds,
  getLevelFromConsumed,
  getProgressToNextLevel,
} from '@/game/LevelCurve';

export interface HoleState {
  x: number;
  y: number;
  level: number;
  consumed: number;
  radius: number;
  progress: number;
}

export class Hole {
  private thresholds: number[] = [];
  private consumed = 0;
  private level = 1;
  private x = 0;
  private y = 0;

  initialize(totalElements: number, startX: number, startY: number): void {
    this.thresholds = buildLevelThresholds(totalElements);
    this.consumed = 0;
    this.level = 1;
    this.x = startX;
    this.y = startY;
  }

  getState(): HoleState {
    return {
      x: this.x,
      y: this.y,
      level: this.level,
      consumed: this.consumed,
      radius: this.getRadius(),
      progress: getProgressToNextLevel(this.consumed, this.level, this.thresholds),
    };
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  getRadius(): number {
    const index = Math.min(this.level, LEVEL_COUNT) - 1;
    return HOLE_LEVEL_RADIUS[index] ?? HOLE_LEVEL_RADIUS[0] ?? 24;
  }

  getInfluenceRadius(): number {
    return this.getRadius() * HOLE_INFLUENCE_MULTIPLIER;
  }

  canConsume(bodySize: number): boolean {
    return bodySize < this.getRadius() * HOLE_CONSUME_SIZE_FACTOR;
  }

  consume(mass = 1): boolean {
    const previousLevel = this.level;
    this.consumed += mass;
    this.level = getLevelFromConsumed(this.consumed, this.thresholds);
    return this.level > previousLevel;
  }
}
