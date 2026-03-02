import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalScoreComponent } from './final-score.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinalScoreComponent', () => {
  let component: FinalScoreComponent;
  let fixture: ComponentFixture<FinalScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalScoreComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct score', () => {
    component.score = 10;
    fixture.detectChanges();
    const scoreValue = fixture.debugElement.query(
      By.css('.value.success'),
    ).nativeElement;
    expect(scoreValue.textContent.trim()).toBe('10');
  });

  it('should calculate totalScore correctly', () => {
    component.score = 10;
    component.hintPenalty = 4;
    component.skippedCount = 2;
    expect(component.totalScore).toBe(10 + 4 - 2 * 3); 
  });

  it('should calculate hintsUsed correctly', () => {
    component.hintPenalty = 6;
    expect(component.hintsUsed).toBe(3);
  });

  it('should emit playAgainSame when Play Same Settings button is clicked', () => {
    spyOn(component.playAgainSame, 'emit');
    const btn = fixture.debugElement.query(
      By.css('.primary-btn'),
    ).nativeElement;
    btn.click();
    expect(component.playAgainSame.emit).toHaveBeenCalled();
  });

  it('should emit startNewGame when Start New Game button is clicked', () => {
    spyOn(component.startNewGame, 'emit');
    const btn = fixture.debugElement.query(
      By.css('.secondary-btn'),
    ).nativeElement;
    btn.click();
    expect(component.startNewGame.emit).toHaveBeenCalled();
  });

  it('should render the final score correctly', () => {
    component.score = 12;
    component.hintPenalty = 2;
    component.skippedCount = 1;
    fixture.detectChanges();
    const totalScore = fixture.debugElement.query(
      By.css('.total'),
    ).nativeElement;
    expect(totalScore.textContent.trim()).toBe('13');
  });

  it('should render all score rows', () => {
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.score-row'));
    expect(rows.length).toBe(5);
  });
});
