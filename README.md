# 🃏 Flip & Whiz Flashcards

> **Test your knowledge. Master the deck. Claim your spot in the Hall of Fame!** 👑

## 🔍 Overview 

**Flip & Whiz** is not just a study tool—it's a fast-paced, arcade-style trivia experience designed to make learning insanely addictive. Whether you're a student preparing for exams, a trivia master, or just looking to sharpen your mind, this application provides a sleek, glassmorphic environment to test your knowledge against the clock. 

Answer fast, build your score, and fight for the top rank on the global leaderboard!

## ✨ Awesome Features

- 🎨 **Sleek Glassmorphism UI**: A beautiful, premium interface featuring a dynamic **Dark / Light Mode toggle** that completely shifts the color palette from Neon Cyber to Clean EdTech.
- 🧠 **Smart Categories**: Dive into specific decks like History, Geography, Science, Literature, Mathematics, Technology, or risk it all with the Mixed Deck.
- ⏱️ **Arcade-Style Time Attack**: Choose your game duration (1, 3, or 5 minutes). When the clock hits 10 seconds, feel the adrenaline as the screen pulses and the timer ticks!
- 🔊 **Immersive Audio & Visuals**: 
  - Satisfying sound effects for right/wrong answers and game milestones.
  - A dynamic, glowing background aura that reacts to your choices.
  - "Hype" text that floats over your cards ("Lightning!", "Nailed it!", "Ouch!").
  - A neon confetti burst when you successfully conquer a deck!
- 🏆 **Hall of Fame Leaderboard**: Enter your custom alias and compete! Our fully functional local database tracks your scores. Filter the global leaderboard by Category and Time to see who holds the Gold, Silver, and Bronze ranks.
- 🎯 **Strategic Scoring**: Earn points for correct answers, but tread carefully using a Hint costs `-2 points`, and Skipping a question costs `-3 points`!

## 🚀 Quick Start Guide

Since Flip & Whiz features a fully working **Leaderboard**, you will need to run both the frontend application and the local database (`json-server`) at the same time. It's incredibly easy!

### 1. Installation
Clone the repository to your local machine:
```bash
git clone [https://github.com/georgianastasov/flip-and-whiz-flashcard.git](https://github.com/georgianastasov/flip-and-whiz-flashcard.git)
cd flip-and-whiz-flashcard
```

Install the required dependencies:
```bash
npm install
```

### 2. Start the Database (Terminal 1)
Open a terminal inside your project folder and run the mock database. This handles the Hall of Fame saving and ranking:

```bash
npm run api
```
_(Leave this terminal open and running in the background!)_

### 3. Start the Game (Terminal 2)
Open a second terminal window in the same folder and start the Angular application:

```bash
npm start
```

### 4. Play! 🎉
Open your web browser and navigate to: http://localhost:4200 _(Note: The game runs on port 4200, while your database quietly runs on port 3000)_.

## 🛠️ Tech Stack
- Frontend: Angular, TypeScript, HTML5
- Styling: Pure CSS (CSS Variables, Keyframe Animations, Glassmorphism)
- Icons: FontAwesome
- Backend/Database: JSON-Server (Local REST API)
- Extras: Canvas-Confetti (Particle Physics)

## 🤝 Contributing
Contributions are always welcome! Want to add more flashcards? A new category? A multiplayer mode?
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## ⚖️ License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact
Got questions, feedback, or a brilliant idea? Reach out!
**Email: ggeorgianastasov@gmail.com**