import {
  DEFAULT_SETTINGS,
  mergeSettings,
  SETTINGS_STORAGE_KEY,
  type GameSettings,
} from '@/shared/settings/defaults';

export async function loadSettings(): Promise<GameSettings> {
  const result = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  const stored = result[SETTINGS_STORAGE_KEY] as Partial<GameSettings> | undefined;
  return mergeSettings(stored);
}

export async function saveSettings(
  settings: Partial<GameSettings>,
): Promise<GameSettings> {
  const current = await loadSettings();
  const next = mergeSettings({ ...current, ...settings });
  await chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: next });
  return next;
}

export { DEFAULT_SETTINGS, mergeSettings, SETTINGS_STORAGE_KEY };
export type { GameSettings };
