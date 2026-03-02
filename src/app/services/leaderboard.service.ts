import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaderboardEntry {
  id?: string;
  name: string;
  score: number;
  category: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private apiUrl = 'http://localhost:3000/scores';

  constructor(private http: HttpClient) {}

  getScores(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(this.apiUrl);
  }

  addScore(entry: LeaderboardEntry): Observable<LeaderboardEntry> {
    return this.http.post<LeaderboardEntry>(this.apiUrl, entry);
  }
}
