import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  HostListener,
} from '@angular/core';
import { faLightbulb, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent implements OnChanges {
  @Input() public category!: string;
  @Input() public question!: string;
  @Input() public options!: string[];
  @Input() public correctAnswerIndex!: number;
  @Input() public points!: number;
  @Input() public newGame!: boolean;
  @Input() public hint!: string;

  public faLightbulb = faLightbulb;
  public faTrophy = faTrophy;

  public optionSelected = false;
  public selectedAnswerIndex!: number;
  public clickedOptionIndex!: number;

  public hintUsed: boolean = false;
  public hintMessage: string = '';

  private wrongHypes = [
    'FLASHCARD.HYPES.WRONG_1',
    'FLASHCARD.HYPES.WRONG_2',
    'FLASHCARD.HYPES.WRONG_3',
    'FLASHCARD.HYPES.WRONG_4',
  ];
  private correctHypes = [
    'FLASHCARD.HYPES.CORRECT_1',
    'FLASHCARD.HYPES.CORRECT_2',
    'FLASHCARD.HYPES.CORRECT_3',
    'FLASHCARD.HYPES.CORRECT_4',
  ];

  public hypeText: string = '';
  public hypeClass: 'blue' | 'red' | '' = '';
  public auraClass: 'idle' | 'blue' | 'red' = 'idle';

  @Output() answeredCorrect = new EventEmitter<number>();
  @Output() hintUsedCost = new EventEmitter<number>();
  @Output() answered = new EventEmitter<void>();
  @Output() answeredWrong = new EventEmitter<void>();
  @Output() skipRequested = new EventEmitter<void>();

  private advanceTimeout: any;

  constructor(private audioService: AudioService) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.optionSelected) return;

    const key = event.key.toLowerCase();

    if ((key === 'a' || key === '1') && this.options.length > 0)
      this.selectOption(0);
    else if ((key === 'b' || key === '2') && this.options.length > 1)
      this.selectOption(1);
    else if ((key === 'c' || key === '3') && this.options.length > 2)
      this.selectOption(2);
    else if ((key === 'd' || key === '4') && this.options.length > 3)
      this.selectOption(3);
    else if (key === 'h') {
      this.showHint();
    }

    else if (event.code === 'Space') {
      event.preventDefault();
      this.skipRequested.emit();
    }
  }

  public ngOnChanges() {
    this.optionSelected = false;
    this.selectedAnswerIndex = -1;
    this.hintMessage = '';
    this.hintUsed = false;
    clearTimeout(this.advanceTimeout);
    this.hypeText = '';
    this.hypeClass = '';
    this.auraClass = 'idle';
  }

  public selectOption(index: number) {
    if (!this.optionSelected) {
      this.clickedOptionIndex = index;
      this.selectedAnswerIndex = index;
      this.optionSelected = true;

      let delayBeforeNextCard = 1500;

      if (this.selectedAnswerIndex === this.correctAnswerIndex) {
        this.audioService.playSound('assets/sounds/success.mp3');
        this.audioService.triggerVibration(50);
        this.hypeText =
          this.correctHypes[
            Math.floor(Math.random() * this.correctHypes.length)
          ];
        this.hypeClass = 'blue';
        this.auraClass = 'blue';

        this.answeredCorrect.emit(this.points);

        delayBeforeNextCard = 700;
      } else {
        this.audioService.playSound('assets/sounds/wrong.mp3');
        this.audioService.triggerVibration([100, 50, 100]);
        this.hypeText =
          this.wrongHypes[Math.floor(Math.random() * this.wrongHypes.length)];
        this.hypeClass = 'red';
        this.auraClass = 'red';

        this.answeredWrong.emit();
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
      this.audioService.playSound('assets/sounds/hint.mp3');
    }
  }
}
