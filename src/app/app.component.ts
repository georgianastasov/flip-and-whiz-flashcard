import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'flip-and-whiz-flashcard';
  public username: any;

  onUsernameSubmitted(username: string) {
    this.username = username;
  }
}
