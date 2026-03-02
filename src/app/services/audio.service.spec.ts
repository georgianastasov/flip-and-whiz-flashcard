import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    localStorage.removeItem('app_sound');
    TestBed.configureTestingModule({
      providers: [AudioService],
    });
  });

  it('should default isSoundEnabled true when no localStorage value', () => {
    service = TestBed.inject(AudioService);
    expect(service.isSoundEnabled).toBeTrue();
  });

  it('should set isSoundEnabled false when localStorage has "off"', () => {
    localStorage.setItem('app_sound', 'off');
    service = TestBed.inject(AudioService);
    expect(service.isSoundEnabled).toBeFalse();
  });

  it('toggleSound flips flag and updates localStorage', () => {
    service = TestBed.inject(AudioService);
    const initial = service.isSoundEnabled;
    service.toggleSound();
    expect(service.isSoundEnabled).toBe(!initial);
    expect(localStorage.getItem('app_sound')).toBe(
      service.isSoundEnabled ? 'on' : 'off',
    );
  });

  it('playSound creates Audio, sets volume and calls play when enabled', () => {
    service = TestBed.inject(AudioService);

    let createdAudio: any = null;
    const audioSpy = spyOn(window as any, 'Audio').and.callFake(
      (src: string) => {
        createdAudio = {
          src,
          volume: 1,
          play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
        };
        return createdAudio;
      },
    );

    service.isSoundEnabled = true;
    service.playSound('assets/sounds/test.mp3', 0.35);

    expect(audioSpy).toHaveBeenCalledWith('assets/sounds/test.mp3');
    expect(createdAudio).toBeTruthy();
    expect(createdAudio.volume).toBeCloseTo(0.35, 5);
    expect(createdAudio.play).toHaveBeenCalled();
  });

  it('playSound does nothing when sound is disabled', () => {
    service = TestBed.inject(AudioService);
    const audioSpy = spyOn(window as any, 'Audio');
    service.isSoundEnabled = false;
    service.playSound('assets/sounds/test.mp3');
    expect(audioSpy).not.toHaveBeenCalled();
  });

  it('triggerVibration calls navigator.vibrate when available', () => {
    service = TestBed.inject(AudioService);
    (navigator as any).vibrate = jasmine.createSpy('vibrate');
    service.triggerVibration(150);
    expect((navigator as any).vibrate).toHaveBeenCalledWith(150);
    service.triggerVibration([100, 50, 100]);
    expect((navigator as any).vibrate).toHaveBeenCalledWith([100, 50, 100]);
  });
});
