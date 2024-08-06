import { Component, EventEmitter, Input } from '@angular/core';
import { faLightbulb, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Output } from '@angular/core';
@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent {
  public faLightbulb = faLightbulb;
  public faTrophy = faTrophy;

  @Input()
  public question!: string;
  @Input()
  public options!: string[];
  @Input()
  public correctAnswerIndex!: number;
  @Input()
  public points!: number;

  public isAnswerHidden = true;
  public optionSelected = false;

  public selectedAnswerIndex!: number;
  public selectedOptionIndex!: number;
  public clickedOptionIndex!: number;

  @Output() answeredCorrect = new EventEmitter<number>();

  private ngOnChanges() {
    this.isAnswerHidden = true;
    this.optionSelected = false;
    this.selectedAnswerIndex = -1;
  }

  public toggleAnswer() {
    if (this.isAnswerHidden) {
      this.selectedAnswerIndex = this.correctAnswerIndex;
    } else {
      this.selectedAnswerIndex = -1;
    }
    this.isAnswerHidden = !this.isAnswerHidden;
  }

  public getSelectedAnswer() {
    if (this.isAnswerHidden || this.selectedOptionIndex === null) {
      return '';
    } else {
      return this.options[this.selectedOptionIndex];
    }
  }

  public selectOption(index: number) {
    if (this.isAnswerHidden) {
      this.selectedOptionIndex = index;
      if (this.selectedOptionIndex === this.correctAnswerIndex) {
        this.answeredCorrect.emit(this.points);
      }
      this.clickedOptionIndex = index;
      this.selectedAnswerIndex = index;
      this.optionSelected = true;
    }
  }
}