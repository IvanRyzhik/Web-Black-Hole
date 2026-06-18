import type { GameSettings } from '@/shared/settings/types';

export class AudioManager {
  private musicEnabled = true;
  private musicVolume = 0.6;
  private sfxEnabled = true;
  private sfxVolume = 0.8;
  private bgm: HTMLAudioElement | null = null;
  private consume: HTMLAudioElement | null = null;

  applySettings(settings: GameSettings): void {
    this.musicEnabled = settings.musicEnabled;
    this.musicVolume = settings.musicVolume;
    this.sfxEnabled = settings.sfxEnabled;
    this.sfxVolume = settings.sfxVolume;

    if (this.bgm) {
      this.bgm.volume = this.musicVolume;
    }
    if (this.consume) {
      this.consume.volume = this.sfxVolume;
    }
  }

  playBgm(): void {
    if (!this.musicEnabled) {
      return;
    }

    if (!this.bgm) {
      this.bgm = new Audio(chrome.runtime.getURL('audio/bgm.mp3'));
      this.bgm.loop = true;
      this.bgm.volume = this.musicVolume;
    }

    void this.bgm.play().catch(() => {
      // Audio file may not exist yet.
    });
  }

  stopBgm(): void {
    if (!this.bgm) {
      return;
    }

    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  playConsume(): void {
    if (!this.sfxEnabled) {
      return;
    }

    if (!this.consume) {
      this.consume = new Audio(chrome.runtime.getURL('audio/consume.mp3'));
      this.consume.volume = this.sfxVolume;
    }

    const sfx = this.consume.cloneNode() as HTMLAudioElement;
    sfx.volume = this.sfxVolume;
    void sfx.play().catch(() => {
      // Audio file may not exist yet.
    });
  }

  destroy(): void {
    this.stopBgm();
    this.bgm = null;
    this.consume = null;
  }
}
