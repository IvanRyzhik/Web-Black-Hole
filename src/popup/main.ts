import { MessageType } from '@/shared/messaging/types';
import { sendRuntimeMessage } from '@/shared/messaging/sendMessage';
import { loadSettings, saveSettings } from '@/shared/settings/storage';

const statusEl = document.querySelector<HTMLElement>('#status');
const toggleButton = document.querySelector<HTMLButtonElement>('#toggle-game');
const musicEnabled = document.querySelector<HTMLInputElement>('#music-enabled');
const musicVolume = document.querySelector<HTMLInputElement>('#music-volume');
const sfxEnabled = document.querySelector<HTMLInputElement>('#sfx-enabled');
const sfxVolume = document.querySelector<HTMLInputElement>('#sfx-volume');

let gameActive = false;

async function init(): Promise<void> {
  const settings = await loadSettings();
  if (musicEnabled) musicEnabled.checked = settings.musicEnabled;
  if (musicVolume) musicVolume.value = String(Math.round(settings.musicVolume * 100));
  if (sfxEnabled) sfxEnabled.checked = settings.sfxEnabled;
  if (sfxVolume) sfxVolume.value = String(Math.round(settings.sfxVolume * 100));

  const status = await sendRuntimeMessage<{ active: boolean }>({
    type: MessageType.GET_STATUS,
  });

  gameActive = Boolean(status?.active);
  updateUi();
}

function updateUi(): void {
  if (!statusEl || !toggleButton) {
    return;
  }

  statusEl.textContent = gameActive ? 'Game active on this tab' : 'Game inactive';
  toggleButton.textContent = gameActive ? 'Stop' : 'Play';
  toggleButton.classList.toggle('is-stop', gameActive);
}

async function persistAudioSettings(): Promise<void> {
  await saveSettings({
    musicEnabled: musicEnabled?.checked ?? true,
    musicVolume: Number(musicVolume?.value ?? 60) / 100,
    sfxEnabled: sfxEnabled?.checked ?? true,
    sfxVolume: Number(sfxVolume?.value ?? 80) / 100,
  });
}

toggleButton?.addEventListener('click', async () => {
  const settings = await loadSettings();

  if (gameActive) {
    await sendRuntimeMessage({ type: MessageType.STOP_GAME });
    gameActive = false;
  } else {
    await sendRuntimeMessage({ type: MessageType.START_GAME, settings });
    gameActive = true;
  }

  updateUi();
});

for (const input of [musicEnabled, musicVolume, sfxEnabled, sfxVolume]) {
  input?.addEventListener('change', () => {
    void persistAudioSettings();
  });
}

void init();
