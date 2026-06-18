import { GameEngine } from '@/game/GameEngine';
import { MessageType } from '@/shared/messaging/types';
import { onMessage } from '@/shared/messaging/sendMessage';
import { loadSettings } from '@/shared/settings/storage';

let engine: GameEngine | null = null;

onMessage(async (message) => {
  switch (message.type) {
    case MessageType.START_GAME: {
      engine?.stop();
      engine = new GameEngine(message.settings);
      engine.start();
      break;
    }
    case MessageType.STOP_GAME: {
      engine?.stop();
      engine = null;
      break;
    }
    case MessageType.SETTINGS_UPDATED: {
      if (engine?.isActive()) {
        engine.stop();
        engine = new GameEngine(message.settings);
        engine.start();
      }
      break;
    }
    default:
      break;
  }
});

void loadSettings();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    engine?.stop();
    engine = null;
  }
});

const style = document.createElement('style');
style.textContent = `
  .bh-root {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    pointer-events: auto;
  }

  .bh-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
document.documentElement.append(style);
