import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  public gameDuration: number = 1;
  public gameCategory: string = 'All';
  public playerName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const isValidStart = sessionStorage.getItem('valid_game_start');

    if (isValidStart === 'true') {
      sessionStorage.removeItem('valid_game_start');
    } else {
      this.router.navigate(['/']);
    }
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameDuration = params['d'] !== undefined ? parseInt(params['d']) : 1;
      this.gameCategory = params['c'] || 'All';
      this.playerName = params['n'] || 'Player';
    });
  }

  public goToHome() {
    this.router.navigate(['/']);
  }

  public goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
}
