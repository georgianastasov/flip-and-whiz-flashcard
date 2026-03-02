import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FinalScoreComponent } from './final-score.component';
import {
  LeaderboardService,
  LeaderboardEntry,
} from '../services/leaderboard.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinalScoreComponent', () => {
  let fixture: ComponentFixture<FinalScoreComponent>;
  let component: FinalScoreComponent;
  let leaderboardSpy: jasmine.SpyObj<LeaderboardService>;

  const mockScores: LeaderboardEntry[] = [
    { id: '1', name: 'Alice', score: 200, category: 'All', duration: 60 },
    { id: '2', name: 'Bob', score: 150, category: 'All', duration: 60 },
    { id: '3', name: 'Carol', score: 120, category: 'All', duration: 60 },
  ];

  beforeEach(async () => {
    leaderboardSpy = jasmine.createSpyObj('LeaderboardService', [
      'addScore',
      'getScores',
    ]);
    await TestBed.configureTestingModule({
      declarations: [FinalScoreComponent],
      providers: [{ provide: LeaderboardService, useValue: leaderboardSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalScoreComponent);
    component = fixture.componentInstance;
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders score rows and total correctly from inputs', () => {
    component.correctCount = 4;
    component.correctPoints = 40;
    component.wrongCount = 1;
    component.wrongPenalty = 5;
    component.skipCount = 2;
    component.skipPenalty = 6;
    component.hintCount = 1;
    component.hintPenalty = 2;
    component.totalScore = 27;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const correctRow = compiled.querySelectorAll('.score-row')[0];
    const wrongRow = compiled.querySelectorAll('.score-row')[1];
    const skipRow = compiled.querySelectorAll('.score-row')[2];
    const hintRow = compiled.querySelectorAll('.score-row')[3];
    const total = compiled.querySelector('.total') as HTMLElement;

    expect(correctRow.textContent).toContain('+40');
    expect(wrongRow.textContent).toContain('-5');
    expect(skipRow.textContent).toContain('-6');
    expect(hintRow.textContent).toContain('-2');
    expect(total.textContent.trim()).toBe('27');
  });

  it('emits events when buttons are clicked', () => {
    spyOn(component.playAgainSame, 'emit');
    spyOn(component.startNewGame, 'emit');
    spyOn(component.viewLeaderboard, 'emit');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const playBtn = compiled.querySelector('.primary-btn') as HTMLButtonElement;
    const startNewBtn = compiled.querySelectorAll(
      '.primary-btn',
    )[1] as HTMLButtonElement;
    const viewBtn = compiled.querySelector(
      '.tertiary-btn',
    ) as HTMLButtonElement;

    playBtn.click();
    startNewBtn.click();
    viewBtn.click();

    expect(component.playAgainSame.emit).toHaveBeenCalled();
    expect(component.startNewGame.emit).toHaveBeenCalled();
    expect(component.viewLeaderboard.emit).toHaveBeenCalled();
  });

  it('copyToClipboard writes text and shows temporary success', fakeAsync(() => {
    const writeSpy = spyOn(
      navigator.clipboard,
      'writeText' as any,
    ).and.returnValue(Promise.resolve());
    fixture.detectChanges();

    component.totalScore = 42;
    component.playerName = 'Tester';
    component.gameCategory = 'All';
    component.gameDuration = 60;

    component.copyToClipboard();
    tick(); 
    expect(writeSpy).toHaveBeenCalled();
    expect(component.copySuccess).toBeTrue();

    tick(1200);
    expect(component.copySuccess).toBeFalse();
  }));

  it('ngOnInit when victory posts score and computes rank', fakeAsync(() => {
    const created: LeaderboardEntry = {
      id: '99',
      name: 'Me',
      score: 130,
      category: 'All',
      duration: 60,
    };
    const scoresWithMe = [...mockScores, created].sort(
      (a, b) => b.score - a.score,
    );
    leaderboardSpy.addScore.and.returnValue(of(created));
    leaderboardSpy.getScores.and.returnValue(of(scoresWithMe));

    component.isVictory = true;
    component.playerName = 'Me';
    component.gameCategory = 'All';
    component.gameDuration = 60;
    component.totalScore = 130;

    fixture.detectChanges();
    tick();
    expect(leaderboardSpy.addScore).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'Me', score: 130 }),
    );
    expect(leaderboardSpy.getScores).toHaveBeenCalled();
    expect(component.isRankLoading).toBeFalse();
    expect(component.playerRank).toBe(
      scoresWithMe.findIndex((s) => s.id === '99') + 1,
    );
  }));

  it('handles leaderboard save error gracefully', fakeAsync(() => {
    leaderboardSpy.addScore.and.returnValue(
      of({ id: 'x', name: 'X', score: 10, category: 'All', duration: 60 }),
    );
    leaderboardSpy.getScores.and.returnValue(of([]));
    component.isVictory = true;
    component.playerName = 'X';
    fixture.detectChanges();
    tick();
    expect(component.isSavingError).toBeFalse();

    leaderboardSpy.addScore.and.returnValue(
      of({ id: 'y', name: 'Y', score: 0, category: 'All', duration: 60 }),
    );
    leaderboardSpy.getScores.and.returnValue(of([]));
  }));
});
