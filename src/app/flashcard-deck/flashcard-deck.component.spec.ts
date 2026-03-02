import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FlashcardDeckComponent } from './flashcard-deck.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FlashcardDeckComponent', () => {
  let component: FlashcardDeckComponent;
  let fixture: ComponentFixture<FlashcardDeckComponent>;

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
    await TestBed.configureTestingModule({
      declarations: [FlashcardDeckComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardDeckComponent);
    component = fixture.componentInstance;

    spyOn(component as any, 'startGlobalTimer').and.callThrough();

    component.flashcards = [...sampleCards];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formattedTime should format minutes and seconds correctly', () => {
    component.globalTimeLeft = 125;
    expect(component.formattedTime).toBe('2:05');

    component.globalTimeLeft = 9;
    expect(component.formattedTime).toBe('0:09');

    component.globalTimeLeft = 70;
    expect(component.formattedTime).toBe('1:10');
  });

  it('nextCard should advance index and loop to skippedQuestions when present', () => {
    component.currentCardIndex = 0;
    component.flashcards = [sampleCards[0], sampleCards[1]];
    component.skippedQuestions = [];
    component.nextCard();
    expect(component.currentCardIndex).toBe(1);

    component.currentCardIndex = 1;
    component.nextCard();
    expect(component.isGameOver).toBeTrue();

    component.isGameOver = false;
    component.skippedQuestions = [sampleCards[2]];
    component.flashcards = [sampleCards[0]];
    component.currentCardIndex = 0;
    component.nextCard(); 
    expect(component.flashcards).toEqual([sampleCards[2]]);
    expect(component.currentCardIndex).toBe(0);
  });

  it('skipCard should push current card to skippedQuestions, increment skippedCount and deduct points', () => {
    component.flashcards = [sampleCards[0], sampleCards[1]];
    component.currentCardIndex = 0;
    component.answeredCorrectCount = 10;
    component.skippedCount = 0;

    component.skipCard();

    expect(component.skippedQuestions.length).toBe(1);
    expect(component.skippedCount).toBe(1);
    expect(component.answeredCorrectCount).toBe(7); 
    expect(component.currentCardIndex).toBeGreaterThanOrEqual(0);
  });

  it('applyHintPenalty should accumulate hint penalty', () => {
    component.hintPenalty = 0;
    component.applyHintPenalty(-2);
    expect(component.hintPenalty).toBe(-2);
    component.applyHintPenalty(-2);
    expect(component.hintPenalty).toBe(-4);
  });

  it('totalScore should return answeredCorrectCount + hintPenalty', () => {
    component.answeredCorrectCount = 12;
    component.hintPenalty = -4;
    expect(component.totalScore()).toBe(8);
  });

  it('endGameEarly should set isGameOver and clear timer', fakeAsync(() => {
    (component as any).globalTimerInterval = setInterval(() => {}, 1000);
    component.endGameEarly();
    expect(component.isGameOver).toBeTrue();
    expect(component.globalTimeLeft).toBe(0);
    clearInterval((component as any).globalTimerInterval);
  }));

  it('handlePlayAgainSame should reset state and start a new deck', () => {
    const initSpy = spyOn(component as any, 'initializeDeck').and.callThrough();
    const startSpy = spyOn(
      component as any,
      'startGlobalTimer',
    ).and.callThrough();

    component.currentCardIndex = 2;
    component.answeredCorrectCount = 7;
    component.skippedCount = 3;
    component.hintPenalty = -4;
    component.skippedQuestions = [sampleCards[2]];
    component.newGame = false;
    component.isGameOver = true;

    component.handlePlayAgainSame();

    expect(component.currentCardIndex).toBe(0);
    expect(component.answeredCorrectCount).toBe(0);
    expect(component.skippedCount).toBe(0);
    expect(component.hintPenalty).toBe(0);
    expect(component.skippedQuestions.length).toBe(0);
    expect(component.newGame).toBeTrue();
    expect(component.isGameOver).toBeFalse();
    expect(initSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
  });

  it('handleStartNewGame should clear timer and emit returnToHome', () => {
    spyOn(component.returnToHome, 'emit');
    (component as any).globalTimerInterval = setInterval(() => {}, 1000);
    component.handleStartNewGame();
    expect(component.returnToHome.emit).toHaveBeenCalled();
    clearInterval((component as any).globalTimerInterval);
  });

  it('startGlobalTimer should decrement globalTimeLeft and call endGameEarly at zero', fakeAsync(() => {
    spyOn(component, 'endGameEarly');
    component.gameDuration = 0.05;
    component.startGlobalTimer();
    tick(3100);
    expect(component.endGameEarly).toHaveBeenCalled();
    clearInterval((component as any).globalTimerInterval);
  }));
});
