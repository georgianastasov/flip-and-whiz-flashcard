import { Component, Input } from '@angular/core';
import { Flashcard } from './flashcard';
import { FlashcardData } from './flashcardData';
import { faArrowRight, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flashcard-deck',
  templateUrl: './flashcard-deck.component.html',
  styleUrls: ['./flashcard-deck.component.css']
})
export class FlashcardDeckComponent {
  public faArrowRight = faArrowRight;
  public faTrophy = faTrophy;
  public faUser = faUser;

  public flashcards: Flashcard[] = FlashcardData;
  public currentCardIndex = 0;

  public answeredCorrectCount = 0;
  public isGameOver = false;
  public newGame = false;

  @Input()
  public username!: string;

  constructor() {
    this.flashcards = this.shuffleArray(this.flashcards);
  }

  public takeAnsweredCorrectCount(points: number) {
    this.answeredCorrectCount += points;
  }

  public nextCard() {
    this.currentCardIndex++;
    if (this.currentCardIndex >= this.flashcards.length) {
      this.currentCardIndex = 0;
    }
  }

  public gameOver(gameOver: boolean) {
    this.isGameOver = gameOver;
  }

  public handlePlayAgain() {
    this.currentCardIndex = 0;
    this.answeredCorrectCount = 0;
    this.newGame = true;
    this.isGameOver = false;
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}