import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Flashcard } from './flashcard';
import { QuestionsDatabase } from '../database/questionsData';
import { AudioService } from '../services/audio.service';
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
  @Input() playerName: string = '';

  @Output() returnToHome = new EventEmitter<void>();
  @Output() viewLeaderboard = new EventEmitter<void>();

  public faArrowRight = faArrowRight;
  public faTrophy = faTrophy;
  public faUser = faUser;
  public faFlagCheckered = faFlagCheckered;

  public flashcards: Flashcard[] = [];
  public currentCardIndex = 0;

  public totalScore: number = 0;
  public correctCount = 0;
  public correctPoints = 0;
  public wrongCount = 0;
  public wrongPenalty = 0;
  public skipCount = 0;
  public skipPenalty = 0;
  public hintCount = 0;
  public hintPenalty = 0;
  public isGameOver = false;
  public newGame = false;
  public isVictory = false;

  public skippedQuestions: Flashcard[] = [];

  public globalTimeLeft: number = 60;

  public scorePopupText: string = '';
  public scorePopupClass: 'success' | 'danger' | '' = '';
  public scorePopupDuration: number = 1000;

  private scorePopupTimeout: any;
  private globalTimerInterval: any;
  private langChangeSub!: Subscription;
  private deckIndices: number[] = [];
  private skippedIndices: number[] = [];

  constructor(
    private translate: TranslateService,
    private audioService: AudioService,
  ) {}

  public ngOnInit() {
    this.initializeDeck(true);
    this.startGlobalTimer();

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.initializeDeck(false);
    });
  }

  public ngOnDestroy() {
    clearInterval(this.globalTimerInterval);
    if (this.langChangeSub) this.langChangeSub.unsubscribe();
  }

  public startGlobalTimer() {
    if (this.gameDuration === 0) return;

    this.globalTimeLeft = this.gameDuration * 60;
    clearInterval(this.globalTimerInterval);

    this.globalTimerInterval = setInterval(() => {
      this.globalTimeLeft--;
      if (this.globalTimeLeft <= 10 && this.globalTimeLeft > 0) {
        this.audioService.playSound('assets/sounds/ticking.mp3', 0.5);
      }
      if (this.globalTimeLeft <= 0) {
        this.triggerEndGame(true);
      }
    }, 1000);
  }

  public get formattedTime(): string {
    const m = Math.floor(this.globalTimeLeft / 60);
    const s = this.globalTimeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  public takeAnsweredCorrectCount(points: number) {
    this.correctCount++;
    this.correctPoints += points;
    this.updateScoreUI();
    this.triggerScorePopup(`+${points}`, 'success', 700);
  }

  public handleWrongAnswer() {
    this.wrongCount++;
    this.wrongPenalty += 5;
    this.updateScoreUI();
    this.triggerScorePopup('-5', 'danger', 1500);

    if (this.gameDuration === 0) {
      this.triggerEndGame(false);
    }
  }

  public skipCard() {
    this.audioService.playSound('assets/sounds/skip.mp3');

    this.skippedIndices.push(this.deckIndices[this.currentCardIndex]);
    this.skippedQuestions.push(this.flashcards[this.currentCardIndex]);

    this.skipCount++;
    this.skipPenalty += 3;
    this.updateScoreUI();
    this.triggerScorePopup('-3', 'danger', 600);

    this.nextCard();
  }

  public applyHintPenalty(points: number) {
    this.hintCount++;
    this.hintPenalty += Math.abs(points);
    this.updateScoreUI();
    this.triggerScorePopup('-2', 'danger', 600);
  }

  public nextCard() {
    if (this.isGameOver) return;

    this.currentCardIndex++;
    if (this.currentCardIndex >= this.flashcards.length) {
      if (this.skippedQuestions.length > 0) {
        this.flashcards = this.skippedQuestions;
        this.deckIndices = [...this.skippedIndices];

        this.skippedQuestions = [];
        this.skippedIndices = [];
        this.currentCardIndex = 0;
      } else {
        this.currentCardIndex = 0;
        this.triggerEndGame(true);
      }
    }
  }

  public triggerEndGame(victory: boolean) {
    this.isGameOver = true;
    this.isVictory = victory;
    this.globalTimeLeft = 0;
    clearInterval(this.globalTimerInterval);

    if (victory) {
      this.audioService.playSound('assets/sounds/win.mp3');
    } else {
      this.audioService.playSound('assets/sounds/end.mp3');
    }
  }

  public giveUp() {
    this.triggerEndGame(false);
  }

  public handlePlayAgainSame() {
    this.currentCardIndex = 0;
    this.correctCount = 0;
    this.correctPoints = 0;
    this.wrongCount = 0;
    this.wrongPenalty = 0;
    this.skipCount = 0;
    this.skipPenalty = 0;
    this.hintCount = 0;
    this.hintPenalty = 0;
    this.totalScore = 0;
    this.skippedQuestions = [];

    this.newGame = true;
    this.isGameOver = false;
    this.isVictory = false;

    this.initializeDeck(true);
    this.startGlobalTimer();
  }

  public handleStartNewGame() {
    clearInterval(this.globalTimerInterval);
    this.returnToHome.emit();
  }

  public handleViewLeaderboard() {
    this.viewLeaderboard.emit();
  }

  private initializeDeck(isNewGame: boolean) {
    const currentLang = this.translate.currentLang || 'en';
    const languageSpecificQuestions =
      QuestionsDatabase[currentLang] || QuestionsDatabase['en'];

    const filteredBase =
      this.gameCategory === 'All'
        ? [...languageSpecificQuestions]
        : languageSpecificQuestions.filter(
            (card) => card.category === this.gameCategory,
          );

    if (isNewGame) {
      let indices = Array.from(filteredBase.keys());
      this.deckIndices = this.shuffleArray(indices);
      this.skippedIndices = [];
    }

    this.flashcards = this.deckIndices.map((i) => filteredBase[i]);
    this.skippedQuestions = this.skippedIndices.map((i) => filteredBase[i]);
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private triggerScorePopup(
    text: string,
    type: 'success' | 'danger',
    duration: number,
  ) {
    this.scorePopupText = '';
    clearTimeout(this.scorePopupTimeout);

    setTimeout(() => {
      this.scorePopupText = text;
      this.scorePopupClass = type;
      this.scorePopupDuration = duration;
    }, 10);

    this.scorePopupTimeout = setTimeout(() => {
      this.scorePopupText = '';
    }, duration + 10);
  }

  private updateScoreUI() {
    this.totalScore =
      this.correctPoints -
      this.wrongPenalty -
      this.skipPenalty -
      this.hintPenalty;
  }
}
