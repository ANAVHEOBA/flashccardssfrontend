'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import PracticeCard from '@/components/practice/PracticeCard';
import SessionResults from '@/components/practice/SessionResults';
import { LanguageSlug } from '@/types/language';
import { languageService } from '@/services/language.service';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as LanguageSlug;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    practiceSession,
    sessionStats,
    isLoading,
    startPracticeSession,
    answerFlashcard,
    nextFlashcard,
    previousFlashcard,
    submitSession,
    endSession,
  } = useProgress();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && slug && !practiceSession) {
      startPracticeSession(slug, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, slug]);

  const handleAnswer = (isCorrect: boolean) => {
    if (!practiceSession) return;

    const currentFlashcard = practiceSession.flashcards[practiceSession.currentIndex];
    answerFlashcard(currentFlashcard._id, isCorrect);
  };

  const handleNext = () => {
    if (!practiceSession) return;

    if (practiceSession.currentIndex === practiceSession.flashcards.length - 1) {
      // Last card - submit session
      handleSubmitSession();
    } else {
      nextFlashcard();
    }
  };

  const handlePrevious = () => {
    previousFlashcard();
  };

  const handleSubmitSession = async () => {
    setIsSubmitting(true);
    const success = await submitSession();
    if (success) {
      setShowResults(true);
    }
    setIsSubmitting(false);
  };

  const handleContinuePractice = () => {
    setShowResults(false);
    endSession();
    startPracticeSession(slug, 10);
  };

  const handleFinish = () => {
    endSession();
    router.push(`/languages/${slug}`);
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading || !practiceSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading practice session...</p>
        </div>
      </div>
    );
  }

  const currentFlashcard = practiceSession.flashcards[practiceSession.currentIndex];
  const isAnswered = practiceSession.results.has(currentFlashcard._id);
  const userAnswer = practiceSession.results.get(currentFlashcard._id);
  const isLastCard = practiceSession.currentIndex === practiceSession.flashcards.length - 1;
  const languageIcon = languageService.getLanguageIcon(slug);

  // Show results screen
  if (showResults && sessionStats) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto">
          <SessionResults
            stats={sessionStats}
            onContinue={handleContinuePractice}
            onFinish={handleFinish}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/languages/${slug}`)}
                className="text-secondary hover:text-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{languageIcon}</span>
                <div>
                  <h1 className="text-xl font-bold">Practice Mode</h1>
                  <p className="text-sm text-secondary">
                    Card {practiceSession.currentIndex + 1} of{' '}
                    {practiceSession.flashcards.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-card rounded-lg border border-card-hover">
                <span className="text-sm text-secondary">Answered: </span>
                <span className="text-sm font-semibold text-primary">
                  {practiceSession.results.size} / {practiceSession.flashcards.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-card-hover">
        <div className="container mx-auto px-4 py-2">
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((practiceSession.currentIndex + 1) /
                    practiceSession.flashcards.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <PracticeCard
            flashcard={currentFlashcard}
            onAnswer={handleAnswer}
            isAnswered={isAnswered}
            userAnswer={userAnswer}
          />

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={practiceSession.currentIndex === 0}
              className="px-6 py-3 bg-card text-foreground rounded-lg font-semibold hover:bg-card-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-sm text-secondary">
              {practiceSession.currentIndex + 1} / {practiceSession.flashcards.length}
            </div>

            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className="px-6 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLastCard ? 'Finish' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
