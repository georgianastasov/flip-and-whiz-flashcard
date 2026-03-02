import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FlashcardComponent } from './flashcard.component';
import { AudioService } from '../services/audio.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FlashcardComponent', () => {
  let fixture: ComponentFixture<FlashcardComponent>;
  let component: FlashcardComponent;
  let audioSpy: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    audioSpy = jasmine.createSpyObj('AudioService', [
      'playSound',
      'triggerVibration',
    ]);

    await TestBed.configureTestingModule({
      declarations: [FlashcardComponent],
      providers: [{ provide: AudioService, useValue: audioSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardComponent);
    component = fixture.componentInstance;

    component.category = 'Science';
    component.question = 'What is H2O?';
    component.options = ['Oxygen', 'Water', 'Hydrogen', 'Helium'];
    component.correctAnswerIndex = 1;
    component.points = 10;
    component.hint = 'Two parts hydrogen, one oxygen';
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders question and options', () => {
    const q = fixture.debugElement.query(By.css('.question')).nativeElement;
    expect(q.textContent).toContain('What is H2O?');
    const opts = fixture.debugElement.queryAll(By.css('.option-btn'));
    expect(opts.length).toBe(4);
    expect(opts[1].nativeElement.textContent).toContain('Water');
  });

  it('selecting correct option plays success, vibrates, emits answeredCorrect and sets aura/hype', fakeAsync(() => {
    spyOn(component.answeredCorrect, 'emit');
    spyOn(component.answered, 'emit');
    component.selectOption(1);
    fixture.detectChanges();

    expect(component.optionSelected).toBeTrue();
    expect(component.clickedOptionIndex).toBe(1);
    expect(audioSpy.playSound).toHaveBeenCalledWith(
      'assets/sounds/success.mp3',
    );
    expect(audioSpy.triggerVibration).toHaveBeenCalledWith(50);
    expect(component.hypeClass).toBe('blue');
    expect(component.auraClass).toBe('blue');
    expect(component.hypeText).toBeTruthy();
    expect(component.answeredCorrect.emit).toHaveBeenCalledWith(10);

    tick(900);
    expect(component.hypeText).toBe('');

    tick(700);
    expect(component.answered.emit).toHaveBeenCalled();
  }));

  it('selecting wrong option plays wrong sound, vibrates pattern, emits answeredWrong and marks classes', fakeAsync(() => {
    spyOn(component.answeredWrong, 'emit');
    spyOn(component.answered, 'emit');
    component.selectOption(0);
    fixture.detectChanges();

    expect(audioSpy.playSound).toHaveBeenCalledWith('assets/sounds/wrong.mp3');
    expect(audioSpy.triggerVibration).toHaveBeenCalledWith([100, 50, 100]);
    expect(component.hypeClass).toBe('red');
    expect(component.auraClass).toBe('red');
    expect(component.answeredWrong.emit).toHaveBeenCalled();

    const optionBtns = fixture.debugElement.queryAll(By.css('.option-btn'));
    expect(optionBtns[1].nativeElement.classList).toContain('correct');
    expect(optionBtns[0].nativeElement.classList).toContain('wrong');

    tick(900);
    expect(component.hypeText).toBe('');
    tick(1500);
    expect(component.answered.emit).toHaveBeenCalled();
  }));

  it('hype element appears only above chosen option', fakeAsync(() => {
    component.selectOption(2);
    fixture.detectChanges();
    const lis = fixture.debugElement.queryAll(By.css('.option-item'));
    const hypeCounts = lis.map(
      (li, i) =>
        !!li.query(By.css('.hype')) && component.clickedOptionIndex === i,
    );
    expect(hypeCounts.filter(Boolean).length).toBe(1);
    expect(component.clickedOptionIndex).toBe(2);
  }));

  it('showHint emits cost and plays hint sound when allowed', () => {
    spyOn(component.hintUsedCost, 'emit');
    component.showHint();
    expect(component.hintMessage).toBe('Two parts hydrogen, one oxygen');
    expect(component.hintUsedCost.emit).toHaveBeenCalledWith(-2);
    expect(audioSpy.playSound).toHaveBeenCalledWith('assets/sounds/hint.mp3');
  });

  it('showHint does nothing when hint already used or option selected', () => {
    component.hintUsed = true;
    component.hintMessage = '';
    component.showHint();
    expect(component.hintMessage).toBe('');

    component.hintUsed = false;
    component.optionSelected = true;
    component.showHint();
    expect(component.hintMessage).toBe('');
  });

  it('keyboard shortcuts select options, show hint and emit skipRequested', () => {
    spyOn(component.skipRequested, 'emit');
    spyOn(component.answeredCorrect, 'emit');
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(component.optionSelected).toBeTrue();
    component.ngOnChanges();
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'h' }));
    expect(component.hintMessage).toBe('Two parts hydrogen, one oxygen');
    const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' });
    component.handleKeyboardEvent(spaceEvent);
    expect(component.skipRequested.emit).toHaveBeenCalled();
  });

  it('ngOnChanges resets state', () => {
    component.optionSelected = true;
    component.selectedAnswerIndex = 2;
    component.hintMessage = 'x';
    component.hintUsed = true;
    component.hypeText = 'y';
    component.hypeClass = 'red';
    component.auraClass = 'blue';
    component.ngOnChanges();
    expect(component.optionSelected).toBeFalse();
    expect(component.selectedAnswerIndex).toBe(-1);
    expect(component.hintMessage).toBe('');
    expect(component.hintUsed).toBeFalse();
    expect(component.hypeText).toBe('');
    expect(component.hypeClass).toBe('');
    expect(component.auraClass).toBe('idle');
  });
});
