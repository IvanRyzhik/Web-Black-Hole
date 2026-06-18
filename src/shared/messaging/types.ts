import type { GameSettings } from '@/shared/settings/types';

export const MessageType = {
  START_GAME: 'START_GAME',
  STOP_GAME: 'STOP_GAME',
  GAME_STATUS: 'GAME_STATUS',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  GET_STATUS: 'GET_STATUS',
} as const;

export type MessageTypeName = (typeof MessageType)[keyof typeof MessageType];

export interface StartGameMessage {
  type: typeof MessageType.START_GAME;
  settings: GameSettings;
}

export interface StopGameMessage {
  type: typeof MessageType.STOP_GAME;
}

export interface GameStatusMessage {
  type: typeof MessageType.GAME_STATUS;
  active: boolean;
  tabId?: number;
}

export interface SettingsUpdatedMessage {
  type: typeof MessageType.SETTINGS_UPDATED;
  settings: GameSettings;
}

export interface GetStatusMessage {
  type: typeof MessageType.GET_STATUS;
}

export type ExtensionMessage =
  | StartGameMessage
  | StopGameMessage
  | GameStatusMessage
  | SettingsUpdatedMessage
  | GetStatusMessage;

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (!value || typeof value !== 'object' || !('type' in value)) {
    return false;
  }

  const type = (value as { type: unknown }).type;
  return Object.values(MessageType).includes(type as MessageTypeName);
}
