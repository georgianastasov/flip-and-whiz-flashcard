import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard.component';
import {
  LeaderboardService,
  LeaderboardEntry,
} from '../services/leaderboard.service';
import { of, Subject, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let mockService: jasmine.SpyObj<LeaderboardService>;

  const sampleScores: LeaderboardEntry[] = [
    { id: '1', name: 'Alice', score: 120, category: 'All', duration: 60 },
    { id: '2', name: 'Bob', score: 90, category: 'Math', duration: 30 },
    { id: '3', name: 'Carol', score: 150, category: 'Science', duration: 45 },
    { id: '4', name: 'Dan', score: 110, category: 'Math', duration: 30 },
    { id: '5', name: 'Eve', score: 80, category: 'Science', duration: 0 },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('LeaderboardService', ['getScores']);

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [LeaderboardComponent],
      providers: [{ provide: LeaderboardService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockService.getScores.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit / fetchScores sets allScores and displayedScores and clears loading', fakeAsync(() => {
    const subj = new Subject<LeaderboardEntry[]>();
    mockService.getScores.and.returnValue(subj.asObservable());

    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();

    subj.next(sampleScores);
    subj.complete();
    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.allScores.length).toBe(sampleScores.length);

    expect(component.displayedScores[0].score).toBe(150);
    expect(
      component.displayedScores[component.displayedScores.length - 1].score,
    ).toBe(80);
  }));

  it('applyFilters filters by category and duration and applies limit', () => {
    mockService.getScores.and.returnValue(of(sampleScores));
    fixture.detectChanges();

    component.selectedCategory = 'Math';
    component.selectedDuration = '30';
    component.selectedLimit = 50;
    component.applyFilters();

    expect(component.displayedScores.length).toBe(2);
    expect(component.displayedScores[0].name).toBe('Dan');
    expect(component.displayedScores[1].name).toBe('Bob');
  });

  it('selectCategory/selectDuration/selectLimit update state and reapply filters', () => {
    mockService.getScores.and.returnValue(of(sampleScores));
    fixture.detectChanges();

    component.selectCategory('Science');
    expect(component.selectedCategory).toBe('Science');
    expect(component.isCategoryMenuOpen).toBeFalse();

    component.selectDuration('0');
    expect(component.selectedDuration).toBe('0');
    expect(component.isDurationMenuOpen).toBeFalse();

    component.selectLimit(2);
    expect(component.selectedLimit).toBe(2);
    expect(component.isLimitMenuOpen).toBeFalse();

    expect(component.displayedScores.length).toBe(2);
    expect(component.displayedScores[0].category).toBe('Science');
  });

  it('setGlobalAllTime resets filters to defaults', () => {
    mockService.getScores.and.returnValue(of(sampleScores));
    fixture.detectChanges();

    component.selectedCategory = 'Math';
    component.selectedDuration = '30';
    component.selectedLimit = 50;

    component.setGlobalAllTime();
    expect(component.selectedCategory).toBe('All');
    expect(component.selectedDuration).toBe('All');
    expect(component.selectedLimit).toBe(10);
  });

  it('fetchScores handles error and clears loading flag', fakeAsync(() => {
    mockService.getScores.and.returnValue(
      throwError(() => new Error('Network')),
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.allScores.length).toBe(0);
    expect(component.displayedScores.length).toBe(0);
  }));

  it('clickout closes dropdowns when clicking outside dropdown-group', () => {
    mockService.getScores.and.returnValue(of(sampleScores));
    fixture.detectChanges();

    component.isCategoryMenuOpen = true;
    component.isDurationMenuOpen = true;
    component.isLimitMenuOpen = true;

    const fakeEvent = {
      target: document.createElement('div'),
    } as unknown as Event;
    component.clickout(fakeEvent);

    expect(component.isCategoryMenuOpen).toBeFalse();
    expect(component.isDurationMenuOpen).toBeFalse();
    expect(component.isLimitMenuOpen).toBeFalse();
  });

  it('clickout does not close menus when click is inside dropdown-group', () => {
    mockService.getScores.and.returnValue(of(sampleScores));
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(By.css('.dropdown-group'));
    expect(dropdown).toBeTruthy();

    component.isCategoryMenuOpen = true;
    const insideTarget =
      dropdown.nativeElement.querySelector('*') || dropdown.nativeElement;
    const fakeEvent = { target: insideTarget } as unknown as Event;

    component.clickout(fakeEvent);
    expect(component.isCategoryMenuOpen).toBeTrue();
  });
});
