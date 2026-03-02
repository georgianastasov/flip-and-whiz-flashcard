import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  faTrophy,
  faRedo,
  faHome,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { LeaderboardService } from '../services/leaderboard.service';

@Component({
  selector: 'app-final-score',
  templateUrl: './final-score.component.html',
  styleUrls: ['./final-score.component.css'],
})
export class FinalScoreComponent implements OnInit {
  @Input() totalScore = 0;
  @Input() correctCount = 0;
  @Input() correctPoints = 0;
  @Input() wrongCount = 0;
  @Input() wrongPenalty = 0;
  @Input() skipCount = 0;
  @Input() skipPenalty = 0;
  @Input() hintCount = 0;
  @Input() hintPenalty = 0;

  @Input() isVictory: boolean = false;
  @Input() playerName: string = '';
  @Input() gameCategory: string = '';
  @Input() gameDuration: number = 1;

  @Output() playAgainSame = new EventEmitter<void>();
  @Output() startNewGame = new EventEmitter<void>();
  @Output() viewLeaderboard = new EventEmitter<void>();

  public faTrophy = faTrophy;
  public faRedo = faRedo;
  public faHome = faHome;
  public faList = faList;

  public playerRank: number = 0;
  public totalPlayersInCategory: number = 0;
  public isRankLoading: boolean = true;
  public isSavingError: boolean = false;
  public copySuccess: boolean = false;

  constructor(
    private leaderboardService: LeaderboardService,
    private translate: TranslateService,
  ) {}

  public ngOnInit() {
    if (this.isVictory) {
      this.triggerConfetti();
    }

    if (this.playerName) {
      const finalScoreCalculated = this.totalScore;

      this.leaderboardService
        .addScore({
          name: this.playerName,
          score: finalScoreCalculated,
          category: this.gameCategory,
          duration: this.gameDuration,
        })
        .subscribe({
          next: (savedEntry) => {
            this.calculateRank(savedEntry.id);
          },
          error: (err: any) => {
            console.error('Failed to save score', err);
            this.isSavingError = true;
            this.isRankLoading = false;
          },
        });
    }
  }

  get displayDuration(): string {
    return this.gameDuration === 0
      ? this.translate.instant('COMMON.SUDDEN_DEATH')
      : `${this.gameDuration} ${this.translate.instant('COMMON.MIN')}`;
  }

  get displayCategory(): string {
    if (!this.gameCategory) return '';
    return this.gameCategory === 'All'
      ? this.translate.instant('COMMON.ALL_TOPICS')
      : this.translate.instant(`CATEGORIES.${this.gameCategory.toUpperCase()}`);
  }

  public handlePlayAgainSame(): void {
    this.playAgainSame.emit();
  }

  public handleStartNewGame(): void {
    this.startNewGame.emit();
  }

  public handleViewLeaderboard(): void {
    this.viewLeaderboard.emit();
  }

  public copyToClipboard(): void {
    const scoreText = this.translate.instant('FINAL_SCORE.CLIPBOARD_TEXT', {
      score: this.totalScore,
      duration: this.displayDuration,
      category: this.displayCategory,
      rank: this.playerRank,
    });

    navigator.clipboard
      .writeText(scoreText)
      .then(() => {
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  private calculateRank(savedId: string | undefined) {
    this.leaderboardService.getScores().subscribe({
      next: (allScores: any[]) => {
        if (!allScores) allScores = [];

        const categoryScores = allScores.filter(
          (s: { category: string; duration: number }) =>
            s.category === this.gameCategory &&
            s.duration === this.gameDuration,
        );

        categoryScores.sort(
          (a: { score: number }, b: { score: number }) => b.score - a.score,
        );

        this.totalPlayersInCategory = categoryScores.length;

        const rankIndex = categoryScores.findIndex(
          (s: { id: string | undefined }) => s.id === savedId,
        );
        this.playerRank = rankIndex !== -1 ? rankIndex + 1 : 0;

        this.isRankLoading = false;
      },
      error: () => {
        this.isSavingError = true;
        this.isRankLoading = false;
      },
    });
  }

  private triggerConfetti(): void {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
      const myConfetti = (window as any).confetti;
      if (myConfetti) {
        myConfetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#8b5cf6', '#ec4899'],
          disableForReducedMotion: true,
        });
      }
    };
    document.body.appendChild(script);
  }
}
