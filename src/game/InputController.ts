import { clamp } from '@/shared/utils/clamp';
import { getViewportSize } from '@/shared/utils/dom';

export interface PointerState {
  x: number;
  y: number;
}

export class InputController {
  private pointer: PointerState;
  private keyboard = { up: false, down: false, left: false, right: false };
  private enabled = true;

  constructor(initial: PointerState) {
    this.pointer = initial;
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  getPointer(): PointerState {
    return this.pointer;
  }

  update(): PointerState {
    const speed = 8;
    let { x, y } = this.pointer;

    if (this.keyboard.up) y -= speed;
    if (this.keyboard.down) y += speed;
    if (this.keyboard.left) x -= speed;
    if (this.keyboard.right) x += speed;

    const { width, height } = getViewportSize();
    this.pointer = {
      x: clamp(x, 0, width),
      y: clamp(y, 0, height),
    };

    return this.pointer;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  destroy(): void {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.enabled) {
      return;
    }

    this.pointer = { x: event.clientX, y: event.clientY };
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keyboard.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keyboard.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keyboard.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keyboard.right = true;
        break;
      default:
        break;
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keyboard.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keyboard.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keyboard.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keyboard.right = false;
        break;
      default:
        break;
    }
  };
}
