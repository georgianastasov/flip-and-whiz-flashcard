import { Flashcard } from "./flashcard";

export const FlashcardData: Flashcard[] = [
    // History
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "Who was the first president of the United States?",
        options: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "What is the Magna Carta?",
        options: ["A peace treaty between England and France", "A document limiting the power of the English monarch", "A law code established by Charlemagne", "The constitution of the Roman Republic"],
        correctAnswerIndex: 1,
        points: 30,
    },
    {
        question: "When did the Berlin Wall fall?",
        options: ["1987", "1988", "1989", "1990"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "Who was the first Emperor of China?",
        options: ["Liu Bang", "Qin Shi Huang", "Han Wudi", "Emperor Gaozu"],
        correctAnswerIndex: 1,
        points: 30,
    },
    {
        question: "Who was the first female Prime Minister of the United Kingdom?",
        options: ["Margaret Thatcher", "Theresa May", "Angela Merkel", "Indira Gandhi"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1911", "1912", "1913"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "Who wrote the Declaration of Independence?",
        options: ["Benjamin Franklin", "George Washington", "Thomas Jefferson", "John Adams"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "What ancient civilization built the Machu Picchu?",
        options: ["Aztec", "Inca", "Maya", "Olmec"],
        correctAnswerIndex: 1,
        points: 30,
    },
    {
        question: "What was the primary cause of the Cold War?",
        options: ["Religious conflicts", "Territorial disputes", "Ideological differences", "Resource scarcity"],
        correctAnswerIndex: 2,
        points: 30,
    },

    // Geography
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "What is the name of the desert that covers most of the Arabian Peninsula?",
        options: ["Sahara", "Gobi", "Atacama", "Australian Outback"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "Which country has the longest coastline?",
        options: ["Canada", "Russia", "Australia", "USA"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "What river runs through Baghdad?",
        options: ["Nile", "Tigris", "Euphrates", "Jordan"],
        correctAnswerIndex: 1,
        points: 20,
    },
    {
        question: "What is the smallest country in the world by land area?",
        options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "Which continent is the Sahara Desert located on?",
        options: ["Asia", "Africa", "Australia", "South America"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "Which country has the most natural lakes?",
        options: ["USA", "Canada", "Russia", "Finland"],
        correctAnswerIndex: 1,
        points: 20,
    },
    {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctAnswerIndex: 1,
        points: 20,
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
        correctAnswerIndex: 3,
        points: 10,
    },

    // Science
    {
        question: "What is the atom's smallest unit?",
        options: ["Proton", "Neutron", "Electron", "Quark"],
        correctAnswerIndex: 2,
        points: 30,
    },
    {
        question: "What is the process by which plants use sunlight to produce food?",
        options: ["Photosynthesis", "Cellular respiration", "Fermentation", "Chemosynthesis"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "What is the theory that explains the origin and evolution of the universe?",
        options: ["Big Bang theory", "Steady-state theory", "Geocentric theory", "Heliocentric theory"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Pb", "Pt"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What planet is known as the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Jupiter"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "What planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "What is the most abundant gas in the Earth's atmosphere?",
        options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
        correctAnswerIndex: 3,
        points: 10,
    },
    {
        question: "What part of the cell contains the genetic material?",
        options: ["Cytoplasm", "Ribosome", "Nucleus", "Mitochondria"],
        correctAnswerIndex: 2,
        points: 20,
    },

    // Literature
    {
        question: "Who wrote the novel 'Pride and Prejudice'?",
        options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Charlotte Brontë"],
        correctAnswerIndex: 0,
        points: 10,
    },
    {
        question: "What is the epic poem that tells the story of Odysseus' journey home after the Trojan War?",
        options: ["The Iliad", "The Odyssey", "The Aeneid", "The Metamorphoses"],
        correctAnswerIndex: 1,
        points: 20,
    },
    {
        question: "Who is the main character in Shakespeare's play 'Hamlet'?",
        options: ["Hamlet", "Romeo", "Julius Caesar", "King Lear"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "F. Scott Fitzgerald", "Ernest Hemingway"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "What is the title of the first Harry Potter book?",
        options: ["Harry Potter and the Chamber of Secrets", "Harry Potter and the Goblet of Fire", "Harry Potter and the Philosopher's Stone", "Harry Potter and the Order of the Phoenix"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "Who wrote '1984'?",
        options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
        correctAnswerIndex: 0,
        points: 20,
    },
    {
        question: "In 'Moby Dick', what is the name of the ship?",
        options: ["Pequod", "Beagle", "Nautilus", "Hispaniola"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "Who is the author of 'The Great Gatsby'?",
        options: ["Ernest Hemingway", "F. Scott Fitzgerald", "William Faulkner", "John Steinbeck"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What is the setting of Shakespeare's 'Romeo and Juliet'?",
        options: ["Rome", "Paris", "Verona", "London"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "Who wrote 'The Catcher in the Rye'?",
        options: ["J.D. Salinger", "Harper Lee", "Mark Twain", "Ernest Hemingway"],
        correctAnswerIndex: 0,
        points: 20,
    },

    // Math
    {
        question: "What is the square root of 25?",
        options: ["2", "5", "10", "There is no real number solution"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What is the formula for the area of a circle?",
        options: ["πr", "2πr", "πr²", "4πr²"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "What is the Pythagorean theorem?",
        options: ["a² + b² = c²", "a + b = c", "a * b = c", "There is no such theorem"],
        correctAnswerIndex: 0,
        points: 30,
    },
    {
        question: "What is 7 times 8?",
        options: ["54", "56", "58", "60"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2"],
        correctAnswerIndex: 1,
        points: 30,
    },
    {
        question: "What is the value of π (pi) approximately?",
        options: ["2.14", "3.14", "4.14", "5.14"],
        correctAnswerIndex: 1,
        points: 10,
    },
    {
        question: "What is 12 squared?",
        options: ["120", "122", "144", "148"],
        correctAnswerIndex: 2,
        points: 20,
    },
    {
        question: "What is the slope of the line y = 3x + 2?",
        options: ["2", "3", "3/2", "1/3"],
        correctAnswerIndex: 1,
        points: 20,
    },
    {
        question: "What is the result of 2^3?",
        options: ["4", "6", "8", "10"],
        correctAnswerIndex: 2,
        points: 10,
    },
    {
        question: "What is the integral of 2x?",
        options: ["x", "x^2", "x^2 + C", "2x + C"],
        correctAnswerIndex: 2,
        points: 30,
    }
];