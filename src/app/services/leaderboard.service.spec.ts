import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LeaderboardService, LeaderboardEntry } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/scores';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaderboardService],
    });
    service = TestBed.inject(LeaderboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getScores() should GET list of scores from api', () => {
    const mockScores: LeaderboardEntry[] = [
      { id: '1', name: 'Alice', score: 120, category: 'All', duration: 60 },
      { id: '2', name: 'Bob', score: 90, category: 'Math', duration: 30 },
    ];

    service.getScores().subscribe((scores) => {
      expect(scores.length).toBe(2);
      expect(scores).toEqual(mockScores);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockScores);
  });

  it('addScore() should POST a score and return the created entry', () => {
    const newEntry: LeaderboardEntry = {
      name: 'Carol',
      score: 75,
      category: 'Science',
      duration: 45,
    };
    const createdEntry: LeaderboardEntry = { id: '3', ...newEntry };

    service.addScore(newEntry).subscribe((res) => {
      expect(res).toEqual(createdEntry);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEntry);
    req.flush(createdEntry);
  });
});
