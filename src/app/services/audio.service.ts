import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public isSoundEnabled: boolean = true;

  constructor() {
    const savedSound = localStorage.getItem('app_sound');
    if (savedSound === 'off') {
      this.isSoundEnabled = false;
    }
  }

  public toggleSound(): void {
    this.isSoundEnabled = !this.isSoundEnabled;
    localStorage.setItem('app_sound', this.isSoundEnabled ? 'on' : 'off');
  }

  public playSound(src: string, volume: number = 1.0): void {
    if (!this.isSoundEnabled) return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  public triggerVibration(pattern: number | number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}
