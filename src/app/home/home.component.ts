import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public wizardState: 'home' | 'duration' | 'category' | 'name' = 'home';
  public selectedDuration: number = 1;
  public selectedCategory: string = 'All';

  public playerName: string = '';
  public nameError: string = '';
  public isNameValid: boolean = false;
  public isHowToPlayOpen: boolean = false;

  private badWords: string[] = [
    'fuck','fucker','fuckers','fucking','motherfucker','motherfuckers','motherfucking','fuk','fukk','fuker','fuking',
    'shit','shithead','shitface','bullshit','shitty','shite',
    'ass','asses','asshole','assholes','arse','arsehole',
    'bitch','bitches','bitchy','bitchass','bitching',
    'cunt','cunts',
    'dick','dicks','dickhead','dickheads','dickface',
    'cock','cocks','cockhead','cockface',
    'pussy','pussies',
    'whore','whores','whorehouse',
    'slut','sluts','slutty',
    'douche','douchebag','douchebags','douchey',
    'bastard','bastards',
    'prick','pricks',
    'twat','wanker',
    'cum','cummed','cumming',
    'piss','pissed','pissoff','piss-off',
    'scum','jerk','jerks','motherfuckerface','fuckface'
  ];

  constructor(private router: Router) {}

  public startGame() {
    this.wizardState = 'duration';
  }

  public setDuration(minutes: number) {
    this.selectedDuration = minutes;
    this.wizardState = 'category';
  }

  public setCategory(category: string) {
    this.selectedCategory = category;
    this.wizardState = 'name';

    setTimeout(() => {
      const inputElement = document.querySelector(
        '.name-input',
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();

        const val = inputElement.value;
        inputElement.value = '';
        inputElement.value = val;
      }
    }, 0);
  }

  public onNameInput(event: Event) {
    const inputName = (event.target as HTMLInputElement).value;
    this.playerName = inputName;
    this.isNameValid = false;

    if (!inputName) {
      this.nameError = '';
      return;
    }
    if (inputName.length < 3) {
      this.nameError = 'ERRORS.NAME_TOO_SHORT';
      return;
    }
    if (inputName.length > 10) {
      this.nameError = 'ERRORS.NAME_TOO_LONG';
      return;
    }
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(inputName)) {
      this.nameError = 'ERRORS.NAME_INVALID_CHARS';
      return;
    }
    const lowerName = inputName.toLowerCase();
    const containsBadWord = this.badWords.some((word) =>
      lowerName.includes(word),
    );
    if (containsBadWord) {
      this.nameError = 'ERRORS.NAME_INAPPROPRIATE';
      return;
    }

    this.nameError = '';
    this.isNameValid = true;
  }

  public startGamePlay() {
    if (this.isNameValid) {
      sessionStorage.setItem('valid_game_start', 'true');

      this.router.navigate(['/play'], {
        queryParams: {
          d: this.selectedDuration,
          c: this.selectedCategory,
          n: this.playerName,
        },
      });
    }
  }

  public goBack() {
    if (this.wizardState === 'name') {
      this.wizardState = 'category';
    } else if (this.wizardState === 'category') {
      this.wizardState = 'duration';
    } else if (this.wizardState === 'duration') {
      this.wizardState = 'home';
    }
  }

  public openLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  public toggleHowToPlay(): void {
    this.isHowToPlayOpen = !this.isHowToPlayOpen;
  }
}
