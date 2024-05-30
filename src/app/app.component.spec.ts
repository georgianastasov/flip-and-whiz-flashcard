import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'flip-and-whiz-flashcard'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('flip-and-whiz-flashcard');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('flip-and-whiz-flashcard app is running!');
  });

  it('should update the username when onUsernameSubmitted is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const newUsername = 'JohnDoe';
    
    app.onUsernameSubmitted(newUsername);
    
    expect(app.username).toEqual(newUsername);
  });

  it('should render the username', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.username = 'JohnDoe';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.username')?.textContent).toContain('JohnDoe');
  });
});
