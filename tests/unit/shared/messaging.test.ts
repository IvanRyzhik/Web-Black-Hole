import { describe, expect, it } from 'vitest';
import { isExtensionMessage, MessageType } from '@/shared/messaging/types';

describe('messaging types', () => {
  it('accepts known extension messages', () => {
    expect(
      isExtensionMessage({
        type: MessageType.START_GAME,
        settings: {
          overlayOpacity: 0.7,
          musicEnabled: true,
          musicVolume: 0.5,
          sfxEnabled: true,
          sfxVolume: 0.5,
        },
      }),
    ).toBe(true);
  });

  it('rejects unknown payloads', () => {
    expect(isExtensionMessage(null)).toBe(false);
    expect(isExtensionMessage({ type: 'UNKNOWN' })).toBe(false);
  });
});
