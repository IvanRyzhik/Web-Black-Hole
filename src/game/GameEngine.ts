import { AudioManager } from '@/game/AudioManager';
import { DecomposerRegistry } from '@/game/Decomposer/DecomposerRegistry';
import { Hole } from '@/game/Hole';
import { HUD } from '@/game/HUD/HUD';
import '@/game/HUD/hud.css';
import { InputController } from '@/game/InputController';
import { PhysicsWorld } from '@/game/PhysicsWorld';
import { SceneManager } from '@/game/SceneManager';
import { saveSettings, type GameSettings } from '@/shared/settings/storage';
import { getViewportSize } from '@/shared/utils/dom';

export class GameEngine {
  private root: HTMLDivElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private scene: SceneManager | null = null;
  private physics: PhysicsWorld | null = null;
  private hole = new Hole();
  private hud: HUD | null = null;
  private input: InputController | null = null;
  private audio = new AudioManager();
  private decomposer = new DecomposerRegistry();
  private totalElements = 0;
  private settings: GameSettings;
  private loopId: number | null = null;
  private active = false;

  constructor(settings: GameSettings) {
    this.settings = settings;
    this.audio.applySettings(settings);
  }

  start(): void {
    if (this.active) {
      return;
    }

    const { width, height } = getViewportSize();
    this.root = document.createElement('div');
    this.root.dataset.blackHoleUi = 'true';
    this.root.className = 'bh-root';

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'bh-canvas';
    this.root.append(this.canvas);
    document.documentElement.append(this.root);

    this.scene = new SceneManager(this.canvas);
    this.scene.setOpacity(this.settings.overlayOpacity);
    this.physics = new PhysicsWorld();
    this.input = new InputController({ x: width / 2, y: height / 2 });

    const { elements, totalElements } = this.decomposer.decompose();
    this.totalElements = totalElements;

    for (const element of elements) {
      this.physics.addElement(element);
      this.scene.spawnElements([element]);
    }

    this.hole.initialize(this.totalElements, width / 2, height / 2);
    this.hud = new HUD(
      this.root,
      {
        onOpacityChange: (opacity) => {
          this.settings = { ...this.settings, overlayOpacity: opacity };
          this.scene?.setOpacity(opacity);
          void saveSettings({ overlayOpacity: opacity });
        },
        onExit: () => this.stop(),
      },
      this.settings,
    );

    this.audio.playBgm();
    this.scene.start();
    this.active = true;
    this.tick();
  }

  stop(): void {
    if (!this.active) {
      return;
    }

    if (this.loopId !== null) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }

    this.audio.destroy();
    this.hud?.destroy();
    this.input?.destroy();
    this.physics?.destroy();
    this.scene?.destroy();
    this.root?.remove();

    this.hud = null;
    this.input = null;
    this.physics = null;
    this.scene = null;
    this.canvas = null;
    this.root = null;
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  private tick = (): void => {
    if (!this.active || !this.scene || !this.physics || !this.input) {
      return;
    }

    const pointer = this.input.update();
    this.hole.setPosition(pointer.x, pointer.y);

    const holeState = this.hole.getState();
    this.physics.applyAttraction(
      holeState.x,
      holeState.y,
      this.hole.getInfluenceRadius(),
    );

    const consumableIds = this.physics.getConsumableIds(
      holeState.x,
      holeState.y,
      holeState.radius,
    );

    for (const [id] of this.physics.getAllBodies()) {
      const position = this.physics.getBodyPosition(id);
      if (position) {
        this.scene.updateMeshPosition(id, position.x, position.y);
      }
    }

    for (const id of consumableIds) {
      this.physics.removeBody(id);
      this.scene.removeElement(id);
      this.hole.consume();
      this.audio.playConsume();
    }

    const nextHoleState = this.hole.getState();
    this.scene.renderHole(nextHoleState.x, nextHoleState.y, nextHoleState.radius, nextHoleState.progress);
    this.hud?.update(nextHoleState, this.totalElements);

    this.loopId = requestAnimationFrame(this.tick);
  };
}
