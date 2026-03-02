import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Flashcard } from './flashcard';
import { FlashcardData } from './flashcardData';
import {
  faArrowRight,
  faTrophy,
  faUser,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flashcard-deck',
  templateUrl: './flashcard-deck.component.html',
  styleUrls: ['./flashcard-deck.component.css'],
})
export class FlashcardDeckComponent implements OnInit, OnDestroy {
  @Input() gameDuration: number = 1;
  @Input() gameCategory: string = 'All';

  @Output() returnToHome = new EventEmitter<void>();

  public faArrowRight = faArrowRight;
  public faTrophy = faTrophy;
  public faUser = faUser;
  public faFlagCheckered = faFlagCheckered;

  public flashcards: Flashcard[] = [];
  public currentCardIndex = 0;

  public answeredCorrectCount = 0;
  public isGameOver = false;
  public newGame = false;

  public skippedQuestions: Flashcard[] = [];
  public skippedCount = 0;

  public hintPenalty = 0;

  public globalTimeLeft: number = 60;

  private globalTimerInterval: any;

  constructor() {}

  public ngOnInit() {
    this.initializeDeck();
    this.startGlobalTimer();
  }

  public ngOnDestroy() {
    clearInterval(this.globalTimerInterval);
  }

  private initializeDeck() {
    if (this.gameCategory === 'All') {
      this.flashcards = [...FlashcardData];
    } else {
      this.flashcards = FlashcardData.filter(
        (card) => card.category === this.gameCategory,
      );
    }
    this.flashcards = this.shuffleArray(this.flashcards);
  }

  public startGlobalTimer() {
    this.globalTimeLeft = this.gameDuration * 60;
    clearInterval(this.globalTimerInterval);

    this.globalTimerInterval = setInterval(() => {
      this.globalTimeLeft--;

      if (this.globalTimeLeft <= 10 && this.globalTimeLeft > 0) {
        const tick = new Audio('assets/sounds/ticking.mp3');
        tick.volume = 0.5;
        tick.play();
      }

      if (this.globalTimeLeft <= 0) {
        const audio = new Audio('assets/sounds/win.mp3');
        audio.play().catch(() => {});
        this.endGameEarly();
      }
    }, 1000);
  }

  public get formattedTime(): string {
    const m = Math.floor(this.globalTimeLeft / 60);
    const s = this.globalTimeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  public takeAnsweredCorrectCount(points: number) {
    this.answeredCorrectCount += points;
  }

  public nextCard() {
    this.currentCardIndex++;
    if (this.currentCardIndex >= this.flashcards.length) {
      if (this.skippedQuestions.length > 0) {
        this.flashcards = this.skippedQuestions;
        this.skippedQuestions = [];
        this.currentCardIndex = 0;
      } else {
        this.currentCardIndex = 0;
        this.endGameEarly();
      }
    }
  }

  public endGameEarly() {
    const audio = new Audio('assets/sounds/end.mp3');
    audio.play().catch(() => {});
    this.isGameOver = true;
    this.globalTimeLeft = 0;
    clearInterval(this.globalTimerInterval);
  }

  public handlePlayAgainSame() {
    this.currentCardIndex = 0;
    this.answeredCorrectCount = 0;
    this.skippedCount = 0;
    this.hintPenalty = 0;
    this.skippedQuestions = [];
    this.newGame = true;
    this.isGameOver = false;

    this.initializeDeck();
    this.startGlobalTimer();
  }

  public handleStartNewGame() {
    clearInterval(this.globalTimerInterval);
    this.returnToHome.emit();
  }

  public skipCard() {
    const audio = new Audio('assets/sounds/skip.mp3');
    audio.play().catch(() => {});
    this.skippedQuestions.push(this.flashcards[this.currentCardIndex]);
    this.skippedCount++;
    this.answeredCorrectCount -= 3;
    this.nextCard();
  }

  public applyHintPenalty(points: number) {
    this.hintPenalty += points;
  }

  public totalScore(): number {
    return this.answeredCorrectCount + this.hintPenalty;
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}