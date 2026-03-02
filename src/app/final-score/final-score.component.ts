import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTrophy, faRedo, faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-final-score',
  templateUrl: './final-score.component.html',
  styleUrls: ['./final-score.component.css'],
})
export class FinalScoreComponent {
  @Input() score = 0;
  @Input() skippedCount = 0;
  @Input() hintPenalty = 0;

  @Output() playAgainSame = new EventEmitter<void>();
  @Output() startNewGame = new EventEmitter<void>();

  public faTrophy = faTrophy;
  public faRedo = faRedo;
  public faHome = faHome;

  get totalScore(): number {
    return this.score + this.hintPenalty - this.skippedCount * 3;
  }

  get hintsUsed(): number {
    return this.hintPenalty / 2;
  }

  public handlePlayAgainSame(): void {
    this.playAgainSame.emit();
  }

  public handleStartNewGame(): void {
    this.startNewGame.emit();
  }
}
