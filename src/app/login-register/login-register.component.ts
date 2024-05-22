import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  @Output() usernameSubmitted = new EventEmitter<string>();
  username: string = '';

  submitUsername() {
    if (this.username.trim() !== '') {
      this.usernameSubmitted.emit(this.username);
    }
  }
}