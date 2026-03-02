import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { faLightbulb, faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent implements OnChanges {
  public faLightbulb = faLightbulb;
  public faTrophy = faTrophy;

  @Input() public category!: string;
  @Input() public question!: string;
  @Input() public options!: string[];
  @Input() public correctAnswerIndex!: number;
  @Input() public points!: number;
  @Input() public newGame!: boolean;
  @Input() public hint!: string;

  public optionSelected = false;
  public selectedAnswerIndex!: number;
  public clickedOptionIndex!: number;

  public hintUsed: boolean = false;
  public hintMessage: string = '';

  private wrongHypes = ['Ouch!', 'Close!', 'Try again!', 'Not quite!'];
  public hypeText: string = '';
  public hypeClass: 'blue' | 'red' | '' = '';

  @Output() answeredCorrect = new EventEmitter<number>();
  @Output() hintUsedCost = new EventEmitter<number>();
  @Output() answered = new EventEmitter<void>();

  private advanceTimeout: any;
  private correctHypes = ['Lightning!', 'Unstoppable!', 'Nailed it!', 'Perfect!'];

  public ngOnChanges() {
    this.optionSelected = false;
    this.selectedAnswerIndex = -1;
    this.hintMessage = '';
    this.hintUsed = false;
    clearTimeout(this.advanceTimeout);
    this.hypeText = '';
    this.hypeClass = '';
  }

  public selectOption(index: number) {
    if (!this.optionSelected) {
      this.clickedOptionIndex = index;
      this.selectedAnswerIndex = index;
      this.optionSelected = true;

      let delayBeforeNextCard = 1500;

      if (this.selectedAnswerIndex === this.correctAnswerIndex) {
        const audio = new Audio('assets/sounds/success.mp3');
        audio.play();
        this.hypeText = this.correctHypes[Math.floor(Math.random() * this.correctHypes.length)];
        this.hypeClass = 'blue';
        this.answeredCorrect.emit(this.points);
        delayBeforeNextCard = 700;
      } else {
        const audio = new Audio('assets/sounds/wrong.mp3');
        audio.play();
        this.hypeText = this.wrongHypes[Math.floor(Math.random() * this.wrongHypes.length)];
        this.hypeClass = 'red';
      }

      setTimeout(() => {
          this.hypeText = '';
          this.hypeClass = '';
      }, 900);

      this.advanceTimeout = setTimeout(() => {
        this.answered.emit();
      }, delayBeforeNextCard);
    }
  }

  public showHint() {
    if (!this.hintUsed && !this.optionSelected) {
      this.hintMessage = this.hint;
      this.hintUsedCost.emit(-2);
      this.hintUsed = true;
      const audio = new Audio('assets/sounds/hint.mp3');
      audio.play().catch(() => {});
    }
  }
}
