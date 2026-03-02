import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { AudioService } from './services/audio.service';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let audioStub: Partial<AudioService>;

  beforeEach(async () => {
    translateSpy = jasmine.createSpyObj('TranslateService', [
      'setDefaultLang',
      'use',
    ]);
    audioStub = { isSoundEnabled: true, toggleSound: () => {} };

    localStorage.removeItem('app_theme');
    localStorage.removeItem('app_lang');
    document.body.classList.remove('light-theme');

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: AudioService, useValue: audioStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('app_theme');
    localStorage.removeItem('app_lang');
    document.body.classList.remove('light-theme');
  });

  it('creates component with expected defaults', () => {
    expect(component).toBeTruthy();
    expect(component.isDarkTheme).toBeTrue();
    expect(component.currentLang).toBe('EN');
    expect(component.currentFlagUrl).toContain('gb.png');
  });

  it('ngOnInit applies saved preferences from localStorage', () => {
    localStorage.setItem('app_theme', 'light');
    localStorage.setItem('app_lang', 'ES');
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isDarkTheme).toBeFalse();
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    expect(component.currentLang).toBe('ES');
    expect(component.currentFlagUrl).toContain('es.png');
    expect(translateSpy.use).toHaveBeenCalledWith('es');
  });

  it('toggleTheme flips theme and updates localStorage and body class', () => {
    fixture.detectChanges();
    expect(component.isDarkTheme).toBeTrue();
    component.toggleTheme();
    expect(component.isDarkTheme).toBeFalse();
    expect(localStorage.getItem('app_theme')).toBe('light');
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    component.toggleTheme();
    expect(component.isDarkTheme).toBeTrue();
    expect(localStorage.getItem('app_theme')).toBe('dark');
    expect(document.body.classList.contains('light-theme')).toBeFalse();
  });

  it('toggleLangMenu toggles isLangMenuOpen', () => {
    expect(component.isLangMenuOpen).toBeFalse();
    component.toggleLangMenu();
    expect(component.isLangMenuOpen).toBeTrue();
    component.toggleLangMenu();
    expect(component.isLangMenuOpen).toBeFalse();
  });

  it('setLanguage updates currentLang, flag, closes menu and calls translate.use and stores lang', () => {
    const lang = {
      code: 'FR',
      flagUrl: 'https://flagcdn.com/w40/fr.png',
    } as any;
    component.isLangMenuOpen = true;
    component.setLanguage(lang);
    expect(component.currentLang).toBe('FR');
    expect(component.currentFlagUrl).toBe(lang.flagUrl);
    expect(component.isLangMenuOpen).toBeFalse();
    expect(translateSpy.use).toHaveBeenCalledWith('fr');
    expect(localStorage.getItem('app_lang')).toBe('FR');
  });

  it('clickout closes lang menu when click outside langSwitcherRef', () => {
    component.isLangMenuOpen = true;
    const host = document.createElement('div');
    component.langSwitcherRef = { nativeElement: host } as ElementRef;
    const outside = document.createElement('div');
    const event = { target: outside } as unknown as Event;
    component.clickout(event);
    expect(component.isLangMenuOpen).toBeFalse();
  });

  it('clickout does not close menu when click is inside langSwitcherRef', () => {
    component.isLangMenuOpen = true;
    const host = document.createElement('div');
    const child = document.createElement('span');
    host.appendChild(child);
    component.langSwitcherRef = { nativeElement: host } as ElementRef;
    const event = { target: child } as unknown as Event;
    component.clickout(event);
    expect(component.isLangMenuOpen).toBeTrue();
  });
});
