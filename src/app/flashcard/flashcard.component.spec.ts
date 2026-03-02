import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardComponent } from './flashcard.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FlashcardComponent', () => {
  let component: FlashcardComponent;
  let fixture: ComponentFixture<FlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlashcardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardComponent);
    component = fixture.componentInstance;
    component.category = 'Science';
    component.question = 'What is the boiling point of water?';
    component.options = ['90°C', '100°C', '110°C', '120°C'];
    component.correctAnswerIndex = 1;
    component.points = 5;
    component.hint = 'It is a round number.';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render question and options', () => {
    const question = fixture.debugElement.query(
      By.css('.question'),
    ).nativeElement;
    expect(question.textContent).toContain(
      'What is the boiling point of water?',
    );
    const optionButtons = fixture.debugElement.queryAll(By.css('.option-btn'));
    expect(optionButtons.length).toBe(4);
    expect(optionButtons[1].nativeElement.textContent).toContain('100°C');
  });

  it('should emit answeredCorrect when correct option is selected', () => {
    spyOn(component.answeredCorrect, 'emit');
    spyOn(component.answered, 'emit');
    component.selectOption(1);
    expect(component.optionSelected).toBeTrue();
    expect(component.answeredCorrect.emit).toHaveBeenCalledWith(5);
  });

  it('should emit answered when any option is selected', (done) => {
    spyOn(component.answered, 'emit');
    component.selectOption(0);
    setTimeout(() => {
      expect(component.answered.emit).toHaveBeenCalled();
      done();
    }, 1600);
  });

  it('should mark correct and wrong options visually', () => {
    component.selectOption(0);
    fixture.detectChanges();
    const optionButtons = fixture.debugElement.queryAll(By.css('.option-btn'));
    expect(optionButtons[1].nativeElement.classList).toContain('correct');
    expect(optionButtons[0].nativeElement.classList).toContain('wrong');
  });

  it('should show hint and emit hintUsedCost', () => {
    spyOn(component.hintUsedCost, 'emit');
    component.showHint();
    fixture.detectChanges();
    expect(component.hintMessage).toBe('It is a round number.');
    expect(component.hintUsedCost.emit).toHaveBeenCalledWith(-2);
    const hintBox = fixture.debugElement.query(
      By.css('.hint-box'),
    ).nativeElement;
    expect(hintBox.textContent).toContain('It is a round number.');
  });

  it('should not show hint if already used or option selected', () => {
    component.hintUsed = true;
    component.showHint();
    expect(component.hintMessage).toBe('');
    component.hintUsed = false;
    component.optionSelected = true;
    component.showHint();
    expect(component.hintMessage).toBe('');
  });

  it('should reset state on ngOnChanges', () => {
    component.optionSelected = true;
    component.selectedAnswerIndex = 2;
    component.hintMessage = 'hint';
    component.hintUsed = true;
    component.ngOnChanges();
    expect(component.optionSelected).toBeFalse();
    expect(component.selectedAnswerIndex).toBe(-1);
    expect(component.hintMessage).toBe('');
    expect(component.hintUsed).toBeFalse();
  });
});
