import Matter from 'matter-js';
import type { SpawnedElement } from '@/game/Decomposer/types';
import { getViewportSize } from '@/shared/utils/dom';

export interface PhysicsBodyHandle {
  id: string;
  body: Matter.Body;
}

export class PhysicsWorld {
  private engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
  private runner = Matter.Runner.create();
  private bodies = new Map<string, Matter.Body>();

  constructor() {
    this.resetBounds();
    Matter.Runner.run(this.runner, this.engine);
  }

  resetBounds(): void {
    const { width, height } = getViewportSize();
    const wallThickness = 80;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
        isStatic: true,
      }),
      Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
      }),
      Matter.Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true },
      ),
    ];

    Matter.Composite.add(this.engine.world, walls);
  }

  addElement(element: SpawnedElement): PhysicsBodyHandle {
    const body = Matter.Bodies.rectangle(element.x, element.y, element.width, element.height, {
      frictionAir: 0.05,
      restitution: 0.1,
    });

    Matter.Composite.add(this.engine.world, body);
    this.bodies.set(element.id, body);
    return { id: element.id, body };
  }

  applyAttraction(
    holeX: number,
    holeY: number,
    influenceRadius: number,
    strength = 0.002,
  ): void {
    for (const body of this.bodies.values()) {
      const dx = holeX - body.position.x;
      const dy = holeY - body.position.y;
      const distance = Math.hypot(dx, dy);

      if (distance === 0 || distance > influenceRadius) {
        continue;
      }

      const forceMagnitude = strength * body.mass * (1 - distance / influenceRadius);
      Matter.Body.applyForce(body, body.position, {
        x: (dx / distance) * forceMagnitude,
        y: (dy / distance) * forceMagnitude,
      });
    }
  }

  getConsumableIds(holeX: number, holeY: number, holeRadius: number): string[] {
    const ids: string[] = [];

    for (const [id, body] of this.bodies.entries()) {
      const dx = holeX - body.position.x;
      const dy = holeY - body.position.y;
      const distance = Math.hypot(dx, dy);
      const bodySize = Math.max(body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);

      if (distance <= holeRadius && bodySize < holeRadius) {
        ids.push(id);
      }
    }

    return ids;
  }

  removeBody(id: string): void {
    const body = this.bodies.get(id);
    if (!body) {
      return;
    }

    Matter.Composite.remove(this.engine.world, body);
    this.bodies.delete(id);
  }

  getBodyPosition(id: string): { x: number; y: number } | null {
    const body = this.bodies.get(id);
    if (!body) {
      return null;
    }

    return { x: body.position.x, y: body.position.y };
  }

  getAllBodies(): Array<[string, Matter.Body]> {
    return [...this.bodies.entries()];
  }

  destroy(): void {
    Matter.Runner.stop(this.runner);
    Matter.Engine.clear(this.engine);
    this.bodies.clear();
  }
}
