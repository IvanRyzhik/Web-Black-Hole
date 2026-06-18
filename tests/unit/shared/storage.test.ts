import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '@/shared/settings/defaults';
import { loadSettings, saveSettings } from '@/shared/settings/storage';

describe('settings storage', () => {
  beforeEach(async () => {
    await chrome.storage.sync.clear();
  });

  it('loads defaults when storage is empty', async () => {
    await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('persists partial updates', async () => {
    const saved = await saveSettings({ overlayOpacity: 0.25, musicEnabled: false });
    expect(saved.overlayOpacity).toBe(0.25);
    expect(saved.musicEnabled).toBe(false);
    expect(saved.sfxEnabled).toBe(true);
  });
});
