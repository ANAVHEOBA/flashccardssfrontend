// Progress & Practice Type Definitions

import { Flashcard } from './flashcard';

export type MasteryLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastered';

export interface PracticeFlashcard extends Flashcard {
  // Additional fields from practice endpoint if any
}

export interface GetPracticeFlashcardsResponse {
  language: string;
  count: number;
  flashcards: PracticeFlashcard[];
}

export interface PracticeResult {
  flashcardId: string;
  isCorrect: boolean;
}

export interface SubmitPracticeRequest {
  results: PracticeResult[];
}

export interface SubmitPracticeResponse {
  message: string;
}

// Quiz Types (Multiple Choice with Timer)

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  flashcardId: string;
  keyword: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface GetQuizResponse {
  language: string;
  count: number;
  questions: QuizQuestion[];
  sessionId: string;
  startedAt: string;
  expiresAt: string;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
}

export interface SubmitQuizRequest {
  sessionId: string;
  results: PracticeResult[];
}

export interface SubmitQuizResponse {
  message: string;
}

export interface QuizSession {
  languageSlug: string;
  sessionId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Map<string, string>; // flashcardId -> selectedOptionId
  startedAt: Date;
  expiresAt: Date;
  timeLimitMinutes: number;
}

export interface QuizSessionStats {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeUsedSeconds: number;
  expired: boolean;
}

export interface LanguageProgress {
  language: string;
  slug: string;
  totalFlashcards: number;
  practiced: number;
  correct: number;
  incorrect: number;
  mastered: number;
  averageAccuracy: number;
}

export interface ProgressSummary {
  totalLanguages: number;
  languagesInProgress: number;
  totalFlashcardsPracticed: number;
  overallAccuracy: number;
  languageStats: LanguageProgress[];
}

export interface PracticeSession {
  languageSlug: string;
  flashcards: PracticeFlashcard[];
  currentIndex: number;
  results: Map<string, boolean>;
  startTime: Date;
  endTime?: Date;
}

export interface PracticeSessionStats {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  duration?: number; // in seconds
}

export interface MasteryRequirements {
  level: MasteryLevel;
  minAttempts: number;
  minAccuracy: number;
  description: string;
}

export const MASTERY_LEVELS: MasteryRequirements[] = [
  {
    level: 'Beginner',
    minAttempts: 0,
    minAccuracy: 0,
    description: 'Just started learning',
  },
  {
    level: 'Intermediate',
    minAttempts: 3,
    minAccuracy: 50,
    description: 'Getting familiar',
  },
  {
    level: 'Advanced',
    minAttempts: 5,
    minAccuracy: 75,
    description: 'Strong understanding',
  },
  {
    level: 'Mastered',
    minAttempts: 10,
    minAccuracy: 90,
    description: 'Complete mastery achieved',
  },
];
