import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  faTrophy,
  faMedal,
  faCrown,
  faHome,
  faGlobe,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  LeaderboardEntry,
  LeaderboardService,
} from '../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  @Output() goHome = new EventEmitter<void>();

  public faTrophy = faTrophy;
  public faMedal = faMedal;
  public faCrown = faCrown;
  public faHome = faHome;
  public faGlobe = faGlobe;
  public faFilter = faFilter;

  public allScores: LeaderboardEntry[] = [];
  public displayedScores: LeaderboardEntry[] = [];
  public isLoading: boolean = true;

  public categories = [
    'All',
    'History',
    'Geography',
    'Science',
    'Literature',
    'Mathematics',
    'Technology',
  ];
  public durations = ['All', '0', '1', '3', '5'];
  public limits = [10, 50, 100];

  public selectedCategory: string = 'All';
  public selectedDuration: string = 'All';
  public selectedLimit: number = 10;

  public isCategoryMenuOpen: boolean = false;
  public isDurationMenuOpen: boolean = false;
  public isLimitMenuOpen: boolean = false;

  constructor(
    private leaderboardService: LeaderboardService,
    private eRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.fetchScores();
  }

  @HostListener('document:click', ['$event'])
  public clickout(event: Event) {
    const dropdownGroup =
      this.eRef.nativeElement.querySelector('.dropdown-group');
    if (dropdownGroup && !dropdownGroup.contains(event.target)) {
      this.isCategoryMenuOpen = false;
      this.isDurationMenuOpen = false;
      this.isLimitMenuOpen = false;
    }
  }

  public toggleCategory() {
    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
    this.isDurationMenuOpen = false;
    this.isLimitMenuOpen = false;
  }

  public toggleDuration() {
    this.isDurationMenuOpen = !this.isDurationMenuOpen;
    this.isCategoryMenuOpen = false;
    this.isLimitMenuOpen = false;
  }

  public toggleLimit() {
    this.isLimitMenuOpen = !this.isLimitMenuOpen;
    this.isCategoryMenuOpen = false;
    this.isDurationMenuOpen = false;
  }

  public selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.isCategoryMenuOpen = false;
    this.onFilterChange();
  }

  public selectDuration(dur: string) {
    this.selectedDuration = dur;
    this.isDurationMenuOpen = false;
    this.onFilterChange();
  }

  public selectLimit(lim: number) {
    this.selectedLimit = lim;
    this.isLimitMenuOpen = false;
    this.onFilterChange();
  }

  public fetchScores(): void {
    this.isLoading = true;
    this.leaderboardService.getScores().subscribe({
      next: (scores) => {
        this.allScores = scores;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load scores', err);
        this.isLoading = false;
      },
    });
  }

  public applyFilters(): void {
    let filtered = [...this.allScores];

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter((s) => s.category === this.selectedCategory);
    }

    if (this.selectedDuration !== 'All') {
      const dur = parseInt(this.selectedDuration, 10);
      filtered = filtered.filter((s) => s.duration === dur);
    }

    filtered.sort((a, b) => b.score - a.score);
    this.displayedScores = filtered.slice(0, this.selectedLimit);
  }

  public setGlobalAllTime(): void {
    this.selectedCategory = 'All';
    this.selectedDuration = 'All';
    this.selectedLimit = 10;
    this.applyFilters();
  }

  public onFilterChange(): void {
    this.applyFilters();
  }

  public handleBackToHome(): void {
    this.goHome.emit();
  }
}
