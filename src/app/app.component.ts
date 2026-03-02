import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public gameState: 'home' | 'duration' | 'category' | 'playing' = 'home';
  public selectedDuration: number = 1; 
  public selectedCategory: string = 'All'; 
  public isDarkTheme: boolean = true; 

  public ngOnInit() {
    this.applyTheme();
  }

  public startGame() {
    this.gameState = 'duration'; 
  }

  public setDuration(minutes: number) {
    this.selectedDuration = minutes;
    this.gameState = 'category'; 
  }

  public setCategory(category: string) {
    this.selectedCategory = category;
    this.gameState = 'playing'; 
  }

  public goBack() {
    if (this.gameState === 'category') {
      this.gameState = 'duration';
    } else if (this.gameState === 'duration') {
      this.gameState = 'home';
    }
  }

  public resetToHome() {
    this.gameState = 'home';
    this.selectedDuration = 1;
    this.selectedCategory = 'All';
  }

  public toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}