import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { FlashcardDeckComponent } from './flashcard-deck/flashcard-deck.component';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookOpen, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { LoginRegisterComponent } from './login-register/login-register.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    FlashcardComponent,
    FlashcardDeckComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [{ provide: FaIconLibrary, useValue: { iconDefinitions: { faBookOpen, faLightbulb } } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
