import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GameComponent', () => {
  let fixture: ComponentFixture<GameComponent>;
  let component: GameComponent;
  let routerSpy: jasmine.SpyObj<Router>;
  let queryParams$: Subject<any>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    queryParams$ = new Subject<any>();

    await TestBed.configureTestingModule({
      declarations: [GameComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams$.asObservable() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.removeItem('valid_game_start');
  });

  it('should redirect to home when sessionStorage does not have valid_game_start', () => {
    sessionStorage.removeItem('valid_game_start');
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should initialize when sessionStorage has valid_game_start true and remove the flag', () => {
    sessionStorage.setItem('valid_game_start', 'true');
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    expect(sessionStorage.getItem('valid_game_start')).toBeNull();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('ngOnInit subscribes to queryParams and sets game properties', () => {
    sessionStorage.setItem('valid_game_start', 'true');
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    queryParams$.next({ d: '5', c: 'Science', n: 'Alice' });
    expect(component.gameDuration).toBe(5);
    expect(component.gameCategory).toBe('Science');
    expect(component.playerName).toBe('Alice');
  });

  it('goToHome navigates to root', () => {
    sessionStorage.setItem('valid_game_start', 'true');
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('goToLeaderboard navigates to leaderboard', () => {
    sessionStorage.setItem('valid_game_start', 'true');
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component.goToLeaderboard();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/leaderboard']);
  });
});
