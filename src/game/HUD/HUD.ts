import type { HoleState } from '@/game/Hole';
import type { GameSettings } from '@/shared/settings/types';
import { clamp } from '@/shared/utils/clamp';

export interface HudCallbacks {
  onOpacityChange: (opacity: number) => void;
  onExit: () => void;
}

export class HUD {
  readonly root: HTMLDivElement;
  private sizeLabel: HTMLSpanElement;
  private counterLabel: HTMLSpanElement;
  private opacitySlider: HTMLInputElement;
  private callbacks: HudCallbacks;

  constructor(parent: HTMLElement, callbacks: HudCallbacks, settings: GameSettings) {
    this.callbacks = callbacks;
    this.root = document.createElement('div');
    this.root.dataset.blackHoleUi = 'true';
    this.root.className = 'bh-hud';

    const topBar = document.createElement('div');
    topBar.className = 'bh-hud__top';

    this.sizeLabel = document.createElement('span');
    this.sizeLabel.className = 'bh-hud__size';
    this.sizeLabel.textContent = 'Size 1';

    this.counterLabel = document.createElement('span');
    this.counterLabel.className = 'bh-hud__counter';
    this.counterLabel.textContent = '0 / 0';

    const opacityWrap = document.createElement('label');
    opacityWrap.className = 'bh-hud__opacity';
    opacityWrap.textContent = 'Opacity';

    this.opacitySlider = document.createElement('input');
    this.opacitySlider.type = 'range';
    this.opacitySlider.min = '0';
    this.opacitySlider.max = '100';
    this.opacitySlider.value = String(Math.round(settings.overlayOpacity * 100));
    this.opacitySlider.addEventListener('input', () => {
      const opacity = Number(this.opacitySlider.value) / 100;
      this.callbacks.onOpacityChange(clamp(opacity, 0, 1));
    });

    opacityWrap.append(this.opacitySlider);

    const exitButton = document.createElement('button');
    exitButton.type = 'button';
    exitButton.className = 'bh-hud__exit';
    exitButton.textContent = 'Exit';
    exitButton.addEventListener('click', () => this.callbacks.onExit());

    topBar.append(this.sizeLabel, this.counterLabel, opacityWrap, exitButton);
    this.root.append(topBar);
    parent.append(this.root);
  }

  update(hole: HoleState, totalElements: number): void {
    this.sizeLabel.textContent = `Size ${hole.level}`;
    this.counterLabel.textContent = `${hole.consumed} / ${totalElements}`;
  }

  destroy(): void {
    this.root.remove();
  }
}
