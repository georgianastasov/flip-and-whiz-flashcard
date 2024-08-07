import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-final-score',
  templateUrl: './final-score.component.html',
  styleUrls: ['./final-score.component.css']
})
export   
 class FinalScoreComponent   
 {
  @Input() score: number = 0;

  @Output() playAgain = new EventEmitter<void>();

  public handlePlayAgain() {
    this.playAgain.emit();
  }
}