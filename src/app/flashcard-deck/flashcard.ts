/**
 * Represents a flashcard.
 */
export interface Flashcard {
    /**
     * The question on the flashcard.
     */
    question: string;
    
    /**
     * The options for the flashcard.
     */
    options: string[];
    
    /**
     * The index of the correct answer in the options array.
     */
    correctAnswerIndex: number;
    
    /**
     * The number of points assigned to the flashcard.
     */
    points: number;

    /**
     * A hint or clue that provides additional guidance to help answer the question.
     * Using the hint may deduct points based on the game's rules.
     */
    hint: string;
}