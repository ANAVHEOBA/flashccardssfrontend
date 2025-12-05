'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { progressService } from '@/services/progress.service';
import {
  LanguageProgress,
  ProgressSummary,
  PracticeSession,
  PracticeResult,
  PracticeSessionStats,
  QuizSession,
  QuizSessionStats,
} from '@/types/progress';
import { LanguageSlug } from '@/types/language';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  // Progress data
  summary: ProgressSummary | null;
  languageProgress: LanguageProgress | null;

  // Practice session (free response, no timer)
  practiceSession: PracticeSession | null;
  sessionStats: PracticeSessionStats | null;

  // Quiz session (multiple choice, with timer)
  quizSession: QuizSession | null;
  quizStats: QuizSessionStats | null;
  quizTimeRemaining: number;

  // Loading & error states
  isLoading: boolean;
  error: string | null;

  // Progress actions
  fetchSummary: () => Promise<void>;
  fetchLanguageProgress: (slug: LanguageSlug) => Promise<void>;

  // Practice session actions
  startPracticeSession: (slug: LanguageSlug, limit?: number) => Promise<boolean>;
  answerFlashcard: (flashcardId: string, isCorrect: boolean) => void;
  nextFlashcard: () => void;
  previousFlashcard: () => void;
  submitSession: () => Promise<boolean>;
  endSession: () => void;

  // Quiz session actions
  startQuizSession: (slug: LanguageSlug, limit?: number) => Promise<boolean>;
  answerQuizQuestion: (flashcardId: string, selectedOptionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<boolean>;
  endQuiz: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Progress state
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [languageProgress, setLanguageProgress] = useState<LanguageProgress | null>(null);

  // Practice session state
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [sessionStats, setSessionStats] = useState<PracticeSessionStats | null>(null);

  // Quiz session state
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [quizStats, setQuizStats] = useState<QuizSessionStats | null>(null);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState<number>(0);

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await progressService.getProgressSummary();

      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        setError(response.message || 'Failed to fetch progress summary');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch progress summary'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguageProgress = async (slug: LanguageSlug) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await progressService.getLanguageProgress(slug);

      if (response.success && response.data) {
        setLanguageProgress(response.data);
      } else {
        setError(response.message || 'Failed to fetch language progress');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch language progress'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startPracticeSession = async (
    slug: LanguageSlug,
    limit: number = 10
  ): Promise<boolean> => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('You must be logged in to practice');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await progressService.getPracticeFlashcards(slug, limit);

      if (response.success && response.data) {
        setPracticeSession({
          languageSlug: slug,
          flashcards: response.data.flashcards,
          currentIndex: 0,
          results: new Map(),
          startTime: new Date(),
        });
        return true;
      } else {
        setError(response.message || 'Failed to start practice session');
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start practice session'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const answerFlashcard = (flashcardId: string, isCorrect: boolean) => {
    if (!practiceSession) return;

    const newResults = new Map(practiceSession.results);
    newResults.set(flashcardId, isCorrect);

    setPracticeSession({
      ...practiceSession,
      results: newResults,
    });
  };

  const nextFlashcard = () => {
    if (!practiceSession) return;
    if (practiceSession.currentIndex < practiceSession.flashcards.length - 1) {
      setPracticeSession({
        ...practiceSession,
        currentIndex: practiceSession.currentIndex + 1,
      });
    }
  };

  const previousFlashcard = () => {
    if (!practiceSession) return;
    if (practiceSession.currentIndex > 0) {
      setPracticeSession({
        ...practiceSession,
        currentIndex: practiceSession.currentIndex - 1,
      });
    }
  };

  const submitSession = async (): Promise<boolean> => {
    if (!practiceSession) return false;

    // Calculate session stats
    const endTime = new Date();
    const stats = progressService.calculateSessionStats(
      practiceSession.results,
      practiceSession.startTime,
      endTime
    );
    setSessionStats(stats);

    // Submit results to backend
    setIsLoading(true);
    setError(null);

    try {
      // Convert results to API format
      const results: PracticeResult[] = Array.from(
        practiceSession.results.entries()
      ).map(([flashcardId, isCorrect]) => ({
        flashcardId,
        isCorrect,
      }));

      const response = await progressService.submitPracticeResults(
        practiceSession.languageSlug as LanguageSlug,
        { results }
      );

      if (response.success) {
        // Update session with end time
        setPracticeSession({
          ...practiceSession,
          endTime,
        });

        // Refresh progress data
        await fetchSummary();
        await fetchLanguageProgress(practiceSession.languageSlug as LanguageSlug);

        return true;
      } else {
        setError(response.message || 'Failed to submit practice results');
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit practice results'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = () => {
    setPracticeSession(null);
    setSessionStats(null);
  };

  // ==================== Quiz Session Methods ====================

  const startQuizSession = async (
    slug: LanguageSlug,
    limit: number = 10
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('You must be logged in to take a quiz');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await progressService.getQuizQuestions(slug, limit);

      if (response.success && response.data) {
        const data = response.data;
        setQuizSession({
          languageSlug: slug,
          sessionId: data.sessionId,
          questions: data.questions,
          currentIndex: 0,
          answers: new Map(),
          startedAt: new Date(data.startedAt),
          expiresAt: new Date(data.expiresAt),
          timeLimitMinutes: data.timeLimitMinutes,
        });
        setQuizTimeRemaining(data.timeRemainingSeconds);
        setQuizStats(null);
        return true;
      } else {
        setError(response.message || 'Failed to start quiz');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const answerQuizQuestion = useCallback((flashcardId: string, selectedOptionId: string) => {
    if (!quizSession) return;

    const newAnswers = new Map(quizSession.answers);
    newAnswers.set(flashcardId, selectedOptionId);

    setQuizSession({
      ...quizSession,
      answers: newAnswers,
    });
  }, [quizSession]);

  const nextQuestion = useCallback(() => {
    if (!quizSession) return;
    if (quizSession.currentIndex < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentIndex: quizSession.currentIndex + 1,
      });
    }
  }, [quizSession]);

  const previousQuestion = useCallback(() => {
    if (!quizSession) return;
    if (quizSession.currentIndex > 0) {
      setQuizSession({
        ...quizSession,
        currentIndex: quizSession.currentIndex - 1,
      });
    }
  }, [quizSession]);

  const submitQuiz = async (): Promise<boolean> => {
    if (!quizSession) return false;

    const endTime = new Date();
    const stats = progressService.calculateQuizStats(quizSession, endTime);
    setQuizStats(stats);

    setIsLoading(true);
    setError(null);

    try {
      // Convert answers to results format
      const results: PracticeResult[] = quizSession.questions.map((question) => {
        const selectedOptionId = quizSession.answers.get(question.flashcardId);
        return {
          flashcardId: question.flashcardId,
          isCorrect: selectedOptionId === question.correctOptionId,
        };
      });

      const response = await progressService.submitQuizResults(
        quizSession.languageSlug as LanguageSlug,
        {
          sessionId: quizSession.sessionId,
          results,
        }
      );

      if (response.success) {
        // Refresh progress data
        await fetchSummary();
        await fetchLanguageProgress(quizSession.languageSlug as LanguageSlug);
        return true;
      } else {
        setError(response.message || 'Failed to submit quiz results');
        return false;
      }
    } catch (err) {
      // Handle timeout error (408)
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      if (errorMessage.includes('expired') || errorMessage.includes('timeout')) {
        setQuizStats((prev) =>
          prev ? { ...prev, expired: true } : null
        );
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const endQuiz = useCallback(() => {
    setQuizSession(null);
    setQuizStats(null);
    setQuizTimeRemaining(0);
  }, []);

  // ==================== Effects ====================

  // Quiz timer countdown
  useEffect(() => {
    if (!quizSession || quizTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setQuizTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSession, quizTimeRemaining]);

  // Fetch summary when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary();
    } else {
      setSummary(null);
      setLanguageProgress(null);
      setPracticeSession(null);
      setQuizSession(null);
      setQuizStats(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value: ProgressContextType = {
    // Progress data
    summary,
    languageProgress,

    // Practice session
    practiceSession,
    sessionStats,

    // Quiz session
    quizSession,
    quizStats,
    quizTimeRemaining,

    // Loading & error states
    isLoading,
    error,

    // Progress actions
    fetchSummary,
    fetchLanguageProgress,

    // Practice session actions
    startPracticeSession,
    answerFlashcard,
    nextFlashcard,
    previousFlashcard,
    submitSession,
    endSession,

    // Quiz session actions
    startQuizSession,
    answerQuizQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    endQuiz,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
