import { DEFAULT_OVERLAY_OPACITY } from '@/game/constants';

export interface GameSettings {
  overlayOpacity: number;
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
}

export const SETTINGS_STORAGE_KEY = 'blackHoleSettings';

export const DEFAULT_SETTINGS: GameSettings = {
  overlayOpacity: DEFAULT_OVERLAY_OPACITY,
  musicEnabled: true,
  musicVolume: 0.6,
  sfxEnabled: true,
  sfxVolume: 0.8,
};

export function mergeSettings(partial: Partial<GameSettings> | null | undefined): GameSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
  };
}
