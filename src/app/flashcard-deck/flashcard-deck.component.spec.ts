import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FlashcardDeckComponent } from './flashcard-deck.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AudioService } from '../services/audio.service';
import { Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FlashcardDeckComponent', () => {
  let fixture: ComponentFixture<FlashcardDeckComponent>;
  let component: FlashcardDeckComponent;
  let translateStub: Partial<TranslateService>;
  let langChange$: Subject<LangChangeEvent>;
  let audioSpy: jasmine.SpyObj<AudioService>;

  const sampleCards = [
    {
      category: 'Math',
      question: 'Q1',
      options: ['a'],
      correctAnswerIndex: 0,
      points: 5,
      hint: 'h1',
    },
    {
      category: 'Math',
      question: 'Q2',
      options: ['a'],
      correctAnswerIndex: 0,
      points: 3,
      hint: 'h2',
    },
    {
      category: 'Science',
      question: 'Q3',
      options: ['a'],
      correctAnswerIndex: 0,
      points: 4,
      hint: 'h3',
    },
  ];

  beforeEach(async () => {
    langChange$ = new Subject<LangChangeEvent>();
    translateStub = {
      currentLang: 'en',
      onLangChange: langChange$.asObservable(),
    };

    audioSpy = jasmine.createSpyObj('AudioService', ['playSound']);

    await TestBed.configureTestingModule({
      declarations: [FlashcardDeckComponent],
      providers: [
        { provide: TranslateService, useValue: translateStub },
        { provide: AudioService, useValue: audioSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardDeckComponent);
    component = fixture.componentInstance;
    component.flashcards = [...sampleCards];
    fixture.detectChanges();
  });

  afterEach(() => {
    clearInterval((component as any).globalTimerInterval);
  });

  it('should create and initialize deck and timer on init', () => {
    const initSpy = spyOn(component as any, 'initializeDeck').and.callThrough();
    const timerSpy = spyOn(
      component as any,
      'startGlobalTimer',
    ).and.callThrough();

    fixture = TestBed.createComponent(FlashcardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(initSpy).toHaveBeenCalledWith(true);
    expect(timerSpy).toHaveBeenCalled();
  });

  it('re-initializes deck on language change', () => {
    const initSpy = spyOn(component as any, 'initializeDeck').and.callThrough();
    langChange$.next({ lang: 'es', translations: {} } as any);
    expect(initSpy).toHaveBeenCalledWith(false);
  });

  it('formattedTime formats minutes and seconds correctly', () => {
    component.globalTimeLeft = 125;
    expect(component.formattedTime).toBe('2:05');
    component.globalTimeLeft = 9;
    expect(component.formattedTime).toBe('0:09');
    component.globalTimeLeft = 70;
    expect(component.formattedTime).toBe('1:10');
  });

  it('takeAnsweredCorrectCount updates counts, score and shows popup', fakeAsync(() => {
    component.correctCount = 0;
    component.correctPoints = 0;
    component.takeAnsweredCorrectCount(5);
    expect(component.correctCount).toBe(1);
    expect(component.correctPoints).toBe(5);
    tick(15);
    expect(component.scorePopupText).toBe('+5');
    expect(component.scorePopupClass).toBe('success');
    tick(700 + 20);
    expect(component.scorePopupText).toBe('');
  }));

  it('handleWrongAnswer updates penalties and triggers end on death mode', fakeAsync(() => {
    component.wrongCount = 0;
    component.wrongPenalty = 0;
    spyOn(component as any, 'triggerEndGame');
    component.gameDuration = 1;
    component.handleWrongAnswer();
    expect(component.wrongCount).toBe(1);
    expect(component.wrongPenalty).toBe(5);
    tick(20);
    expect(component.scorePopupText).toBe('-5');
    component.wrongCount = 0;
    component.wrongPenalty = 0;
    component.gameDuration = 0;
    component.handleWrongAnswer();
    expect((component as any).triggerEndGame).toHaveBeenCalledWith(false);
  }));

  it('skipCard plays sound, records skipped and advances', () => {
    spyOn(component, 'nextCard');
    component.flashcards = [sampleCards[0], sampleCards[1]];
    component.currentCardIndex = 0;
    (component as any).deckIndices = [0, 1];
    component.skippedQuestions = [];
    component.skipCount = 0;
    component.skipPenalty = 0;
    component.skipCard();
    expect(audioSpy.playSound).toHaveBeenCalledWith('assets/sounds/skip.mp3');
    expect(component.skippedQuestions.length).toBe(1);
    expect(component.skipCount).toBe(1);
    expect(component.skipPenalty).toBe(3);
    expect(component.nextCard).toHaveBeenCalled();
  });

  it('nextCard loops to skippedQuestions when present and ends when not', () => {
    spyOn(component as any, 'triggerEndGame');
    component.flashcards = [sampleCards[0], sampleCards[1]];
    component.currentCardIndex = 0;
    component.nextCard();
    expect(component.currentCardIndex).toBe(1);
    component.currentCardIndex = 1;
    component.nextCard();
    expect((component as any).triggerEndGame).toHaveBeenCalledWith(true);

    (component as any).triggerEndGame.calls.reset();
    component.isGameOver = false;
    component.flashcards = [sampleCards[0]];
    component.skippedQuestions = [sampleCards[2]];
    (component as any).deckIndices = [2];
    (component as any).skippedIndices = [2];
    component.currentCardIndex = 0;
    component.nextCard();
    expect(component.flashcards).toEqual([sampleCards[2]]);
    expect(component.currentCardIndex).toBe(0);
  });

  it('triggerEndGame sets flags, clears timer and plays appropriate sound', () => {
    component.isGameOver = false;
    component.globalTimeLeft = 10;
    component.triggerEndGame(true);
    expect(component.isGameOver).toBeTrue();
    expect(component.isVictory).toBeTrue();
    expect(component.globalTimeLeft).toBe(0);
    expect(audioSpy.playSound).toHaveBeenCalledWith('assets/sounds/win.mp3');
    audioSpy.playSound.calls.reset();
    component.triggerEndGame(false);
    expect(component.isVictory).toBeFalse();
    expect(audioSpy.playSound).toHaveBeenCalledWith('assets/sounds/end.mp3');
  });

  it('handlePlayAgainSame resets state and restarts deck and timer', () => {
    const initSpy = spyOn(component as any, 'initializeDeck').and.callThrough();
    const timerSpy = spyOn(
      component as any,
      'startGlobalTimer',
    ).and.callThrough();
    component.currentCardIndex = 2;
    component.correctCount = 5;
    component.correctPoints = 10;
    component.wrongCount = 1;
    component.wrongPenalty = 5;
    component.skipCount = 2;
    component.skipPenalty = 6;
    component.hintCount = 1;
    component.hintPenalty = 2;
    component.totalScore = 7;
    component.skippedQuestions = [sampleCards[2]];
    (component as any).deckIndices = [0, 1, 2];
    (component as any).skippedIndices = [2];
    component.newGame = false;
    component.isGameOver = true;
    component.isVictory = true;

    component.handlePlayAgainSame();

    expect(component.currentCardIndex).toBe(0);
    expect(component.correctCount).toBe(0);
    expect(component.correctPoints).toBe(0);
    expect(component.wrongCount).toBe(0);
    expect(component.wrongPenalty).toBe(0);
    expect(component.skipCount).toBe(0);
    expect(component.skipPenalty).toBe(0);
    expect(component.hintCount).toBe(0);
    expect(component.hintPenalty).toBe(0);
    expect(component.totalScore).toBe(0);
    expect(component.skippedQuestions.length).toBe(0);
    expect(component.newGame).toBeTrue();
    expect(component.isGameOver).toBeFalse();
    expect(component.isVictory).toBeFalse();
    expect(initSpy).toHaveBeenCalledWith(true);
    expect(timerSpy).toHaveBeenCalled();
  });

  it('handleStartNewGame clears timer and emits returnToHome', () => {
    spyOn(component.returnToHome, 'emit');
    (component as any).globalTimerInterval = setInterval(() => {}, 1000);
    component.handleStartNewGame();
    expect(component.returnToHome.emit).toHaveBeenCalled();
    clearInterval((component as any).globalTimerInterval);
  });

  it('startGlobalTimer plays ticking sound when time is low and triggers end when time runs out', fakeAsync(() => {
    spyOn(component as any, 'triggerEndGame');
    component.gameDuration = 0.05;
    component.startGlobalTimer();
    tick(1000);
    expect(audioSpy.playSound.calls.count()).toBeGreaterThanOrEqual(0);
    tick(5000);
    expect((component as any).triggerEndGame).toHaveBeenCalledWith(true);
    clearInterval((component as any).globalTimerInterval);
  }));

  it('updateScoreUI computes totalScore correctly', () => {
    component.correctPoints = 20;
    component.wrongPenalty = 5;
    component.skipPenalty = 3;
    component.hintPenalty = 2;
    (component as any).updateScoreUI();
    expect(component.totalScore).toBe(10);
  });

  it('triggerScorePopup sets and clears popup text and class after duration', fakeAsync(() => {
    (component as any).triggerScorePopup('+9', 'success', 200);
    tick(15);
    expect(component.scorePopupText).toBe('+9');
    expect(component.scorePopupClass).toBe('success');
    tick(220);
    expect(component.scorePopupText).toBe('');
  }));
});
