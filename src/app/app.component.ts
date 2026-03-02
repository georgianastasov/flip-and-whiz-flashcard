import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('langSwitcher') public langSwitcherRef!: ElementRef;

  public isDarkTheme: boolean = true;
  public isLangMenuOpen: boolean = false;
  public currentLang: string = 'EN';
  public currentFlagUrl: string = 'https://flagcdn.com/w40/gb.png';

  public supportedLanguages = [
    {
      code: 'BG',
      flagUrl: 'https://flagcdn.com/w40/bg.png',
      label: 'LANGUAGES.BULGARIAN',
    },
    {
      code: 'DE',
      flagUrl: 'https://flagcdn.com/w40/de.png',
      label: 'LANGUAGES.GERMAN',
    },
    {
      code: 'EN',
      flagUrl: 'https://flagcdn.com/w40/gb.png',
      label: 'LANGUAGES.ENGLISH',
    },
    {
      code: 'ES',
      flagUrl: 'https://flagcdn.com/w40/es.png',
      label: 'LANGUAGES.SPANISH',
    },
    {
      code: 'FR',
      flagUrl: 'https://flagcdn.com/w40/fr.png',
      label: 'LANGUAGES.FRENCH',
    },
    {
      code: 'JA',
      flagUrl: 'https://flagcdn.com/w40/jp.png',
      label: 'LANGUAGES.JAPANESE',
    },
    {
      code: 'PT',
      flagUrl: 'https://flagcdn.com/w40/pt.png',
      label: 'LANGUAGES.PORTUGUESE',
    },
    {
      code: 'RU',
      flagUrl: 'https://flagcdn.com/w40/ru.png',
      label: 'LANGUAGES.RUSSIAN',
    },
    {
      code: 'TR',
      flagUrl: 'https://flagcdn.com/w40/tr.png',
      label: 'LANGUAGES.TURKISH',
    },
    {
      code: 'ZH',
      flagUrl: 'https://flagcdn.com/w40/cn.png',
      label: 'LANGUAGES.CHINESE',
    },
  ];

  constructor(
    private translate: TranslateService,
    public audioService: AudioService,
  ) {
    this.translate.setDefaultLang('en');
  }

  @HostListener('document:click', ['$event'])
  public clickout(event: Event) {
    if (
      this.isLangMenuOpen &&
      this.langSwitcherRef &&
      !this.langSwitcherRef.nativeElement.contains(event.target)
    ) {
      this.isLangMenuOpen = false;
    }
  }

  public ngOnInit() {
    this.loadSavedPreferences();
  }

  public toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('app_theme', this.isDarkTheme ? 'dark' : 'light');
  }

  public setLanguage(lang: any) {
    this.currentLang = lang.code;
    this.currentFlagUrl = lang.flagUrl;
    this.isLangMenuOpen = false;
    this.translate.use(lang.code.toLowerCase());

    localStorage.setItem('app_lang', lang.code);
  }

  public toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  private loadSavedPreferences() {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme === 'light') {
      this.isDarkTheme = false;
    }
    this.applyTheme();

    const savedLangCode = localStorage.getItem('app_lang');
    if (savedLangCode) {
      const foundLang = this.supportedLanguages.find(
        (l) => l.code === savedLangCode,
      );
      if (foundLang) {
        this.currentLang = foundLang.code;
        this.currentFlagUrl = foundLang.flagUrl;
        this.translate.use(foundLang.code.toLowerCase());
      }
    } else {
      this.translate.use('en');
    }
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}
