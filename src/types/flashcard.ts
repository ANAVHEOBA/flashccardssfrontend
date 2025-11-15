// Flashcard Type Definitions

export interface Flashcard {
  _id: string;
  languageId: string;
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FlashcardGenerate {
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
}

export interface GenerateFlashcardsResponse {
  language: string;
  totalGenerated: number;
  flashcards: FlashcardGenerate[];
}

export interface GetFlashcardsResponse {
  language: string;
  totalFlashcards: number;
  flashcards: Flashcard[];
}

export interface FlashcardPracticeState {
  currentIndex: number;
  showAnswer: boolean;
  userAnswers: Map<string, string>;
  correctCount: number;
  incorrectCount: number;
}

export type FlashcardView = 'question' | 'answer' | 'code';

export interface FlashcardStats {
  total: number;
  practiced: number;
  mastered: number;
  remaining: number;
}
