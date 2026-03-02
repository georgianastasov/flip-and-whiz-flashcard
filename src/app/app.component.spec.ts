import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent (TDD)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  const body = document.body;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    body.classList.remove('light-theme');
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with home state and default values', () => {
    expect(component.gameState).toBe('home');
    expect(component.selectedDuration).toBe(1);
    expect(component.selectedCategory).toBe('All');
    expect(component.isDarkTheme).toBeTrue();
  });

  it('ngOnInit should apply the theme (dark by default -> no light-theme class)', () => {
    component.ngOnInit();
    expect(body.classList.contains('light-theme')).toBeFalse();
  });

  it('startGame should change state to duration and show duration section', () => {
    component.startGame();
    fixture.detectChanges();
    expect(component.gameState).toBe('duration');
    expect(
      fixture.nativeElement.querySelector('.duration-section'),
    ).toBeTruthy();
  });

  it('setDuration should set selectedDuration and move to category', () => {
    component.setDuration(3);
    fixture.detectChanges();
    expect(component.selectedDuration).toBe(3);
    expect(component.gameState).toBe('category');
    expect(
      fixture.nativeElement.querySelector('.category-section'),
    ).toBeTruthy();
  });

  it('setCategory should set selectedCategory and move to playing', () => {
    component.setCategory('Science');
    fixture.detectChanges();
    expect(component.selectedCategory).toBe('Science');
    expect(component.gameState).toBe('playing');
    expect(
      fixture.nativeElement.querySelector('app-flashcard-deck'),
    ).toBeTruthy();
  });

  it('goBack should navigate back from category -> duration and duration -> home', () => {
    component.gameState = 'category';
    component.goBack();
    expect(component.gameState).toBe('duration');

    component.gameState = 'duration';
    component.goBack();
    expect(component.gameState).toBe('home');
  });

  it('resetToHome should reset state, duration and category', () => {
    component.gameState = 'playing';
    component.selectedDuration = 5;
    component.selectedCategory = 'History';
    component.resetToHome();
    expect(component.gameState).toBe('home');
    expect(component.selectedDuration).toBe(1);
    expect(component.selectedCategory).toBe('All');
  });

  it('toggleTheme should flip isDarkTheme and update body class', () => {
    expect(component.isDarkTheme).toBeTrue();
    component.toggleTheme();
    expect(component.isDarkTheme).toBeFalse();
    expect(body.classList.contains('light-theme')).toBeTrue();

    component.toggleTheme();
    expect(component.isDarkTheme).toBeTrue();
    expect(body.classList.contains('light-theme')).toBeFalse();
  });

  it('template renders Start button on home and Back button only on intermediate states', () => {
    component.gameState = 'home';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.start-btn')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.back-btn')).toBeNull();

    component.gameState = 'duration';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.back-btn')).toBeTruthy();
  });
});
