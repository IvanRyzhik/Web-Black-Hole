import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, mergeSettings } from '@/shared/settings/defaults';

describe('settings defaults', () => {
  it('merges partial settings with defaults', () => {
    expect(mergeSettings({ overlayOpacity: 0.4 })).toEqual({
      ...DEFAULT_SETTINGS,
      overlayOpacity: 0.4,
    });
  });

  it('returns defaults for empty input', () => {
    expect(mergeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });
});
