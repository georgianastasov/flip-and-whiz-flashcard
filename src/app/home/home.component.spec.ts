import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('valid_game_start');
    const el = document.querySelector('.name-input');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  it('creates component with initial state', () => {
    expect(component).toBeTruthy();
    expect(component.wizardState).toBe('home');
    expect(component.selectedDuration).toBe(1);
    expect(component.selectedCategory).toBe('All');
  });

  it('startGame moves to duration step', () => {
    component.startGame();
    expect(component.wizardState).toBe('duration');
  });

  it('setDuration updates duration and moves to category', () => {
    component.setDuration(3);
    expect(component.selectedDuration).toBe(3);
    expect(component.wizardState).toBe('category');
  });

  it('setCategory updates category, moves to name and focuses input (if present)', fakeAsync(() => {
    const input = document.createElement('input');
    input.className = 'name-input';
    input.value = 'foobar';
    spyOn(input, 'focus');
    document.body.appendChild(input);

    component.setCategory('Science');
    tick(0);
    expect(component.selectedCategory).toBe('Science');
    expect(component.wizardState).toBe('name');
    expect((input as any).focus).toHaveBeenCalled();
    expect(input.value).toBe('foobar');
  }));

  it('onNameInput handles empty input', () => {
    component.onNameInput({ target: { value: '' } } as unknown as Event);
    expect(component.playerName).toBe('');
    expect(component.nameError).toBe('');
    expect(component.isNameValid).toBeFalse();
  });

  it('onNameInput rejects too short names', () => {
    component.onNameInput({ target: { value: 'ab' } } as unknown as Event);
    expect(component.nameError).toBe('ERRORS.NAME_TOO_SHORT');
    expect(component.isNameValid).toBeFalse();
  });

  it('onNameInput rejects too long names', () => {
    component.onNameInput({
      target: { value: 'abcdefghijkl' },
    } as unknown as Event);
    expect(component.nameError).toBe('ERRORS.NAME_TOO_LONG');
    expect(component.isNameValid).toBeFalse();
  });

  it('onNameInput rejects invalid characters', () => {
    component.onNameInput({ target: { value: 'John!' } } as unknown as Event);
    expect(component.nameError).toBe('ERRORS.NAME_INVALID_CHARS');
    expect(component.isNameValid).toBeFalse();
  });

  it('onNameInput rejects names containing bad words', () => {
    component.onNameInput({
      target: { value: 'superFuckinator' },
    } as unknown as Event);
    expect(component.nameError).toBe('ERRORS.NAME_INAPPROPRIATE');
    expect(component.isNameValid).toBeFalse();
  });

  it('onNameInput accepts valid names', () => {
    component.onNameInput({ target: { value: 'Player1' } } as unknown as Event);
    expect(component.playerName).toBe('Player1');
    expect(component.nameError).toBe('');
    expect(component.isNameValid).toBeTrue();
  });

  it('startGamePlay navigates when name valid and stores session flag', () => {
    component.playerName = 'Hero';
    component.selectedDuration = 5;
    component.selectedCategory = 'History';
    component.isNameValid = true;

    component.startGamePlay();

    expect(sessionStorage.getItem('valid_game_start')).toBe('true');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/play'], {
      queryParams: { d: 5, c: 'History', n: 'Hero' },
    });
  });

  it('startGamePlay does nothing when name invalid', () => {
    component.isNameValid = false;
    component.playerName = 'x';
    component.startGamePlay();
    expect(sessionStorage.getItem('valid_game_start')).toBeNull();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('goBack steps back through wizard states', () => {
    component.wizardState = 'name';
    component.goBack();
    expect(component.wizardState).toBe('category');

    component.goBack();
    expect(component.wizardState).toBe('duration');

    component.goBack();
    expect(component.wizardState).toBe('home');
  });

  it('openLeaderboard navigates to leaderboard', () => {
    component.openLeaderboard();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/leaderboard']);
  });

  it('toggleHowToPlay toggles the modal flag', () => {
    expect(component.isHowToPlayOpen).toBeFalse();
    component.toggleHowToPlay();
    expect(component.isHowToPlayOpen).toBeTrue();
    component.toggleHowToPlay();
    expect(component.isHowToPlayOpen).toBeFalse();
  });
});
