'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import QuizCard from '@/components/quiz/QuizCard';
import QuizResults from '@/components/quiz/QuizResults';
import { LanguageSlug } from '@/types/language';
import { languageService } from '@/services/language.service';
import { progressService } from '@/services/progress.service';

const QUESTION_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as LanguageSlug;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    quizSession,
    quizStats,
    quizTimeRemaining,
    isLoading,
    error,
    startQuizSession,
    answerQuizQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    endQuiz,
  } = useProgress();

  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAnswerRevealed, setCurrentAnswerRevealed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Auto-submit when timer runs out
  useEffect(() => {
    if (quizSession && quizTimeRemaining === 0 && !showResults && !isSubmitting) {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizTimeRemaining]);

  const handleStartQuiz = async () => {
    const success = await startQuizSession(slug, selectedQuestionCount);
    if (success) {
      setQuizStarted(true);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (!quizSession || currentAnswerRevealed) return;
    const currentQuestion = quizSession.questions[quizSession.currentIndex];
    answerQuizQuestion(currentQuestion.flashcardId, optionId);
    setCurrentAnswerRevealed(true);
  };

  const handleNext = () => {
    if (!quizSession) return;

    if (quizSession.currentIndex === quizSession.questions.length - 1) {
      handleSubmitQuiz();
    } else {
      nextQuestion();
      setCurrentAnswerRevealed(false);
    }
  };

  const handlePrevious = () => {
    previousQuestion();
    // Keep revealed state for previously answered questions
    if (quizSession) {
      const prevQuestion = quizSession.questions[quizSession.currentIndex - 1];
      setCurrentAnswerRevealed(quizSession.answers.has(prevQuestion?.flashcardId));
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    await submitQuiz();
    setShowResults(true);
    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setShowResults(false);
    setQuizStarted(false);
    setCurrentAnswerRevealed(false);
    endQuiz();
  };

  const handleFinish = () => {
    endQuiz();
    router.push(`/languages/${slug}`);
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const languageIcon = languageService.getLanguageIcon(slug);
  const languageName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Show results
  if (showResults && quizStats) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto">
          <QuizResults stats={quizStats} onRetry={handleRetry} onFinish={handleFinish} />
        </div>
      </div>
    );
  }

  // Quiz setup screen
  if (!quizStarted || !quizSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-card border border-card-hover rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 block">{languageIcon}</span>
              <h1 className="text-2xl font-bold mb-2">{languageName} Quiz</h1>
              <p className="text-secondary">Test your knowledge with multiple choice questions</p>
            </div>

            {/* Timer Info */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-primary">10 Minute Timer</p>
                  <p className="text-sm text-secondary">Complete all questions before time runs out</p>
                </div>
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Number of Questions</label>
              <div className="grid grid-cols-5 gap-2">
                {QUESTION_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedQuestionCount(count)}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      selectedQuestionCount === count
                        ? 'bg-primary text-background'
                        : 'bg-background border border-card-hover text-secondary hover:border-primary/50'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                `Start Quiz (${selectedQuestionCount} Questions)`
              )}
            </button>

            {/* Back Link */}
            <button
              onClick={() => router.push(`/languages/${slug}`)}
              className="w-full mt-4 px-6 py-3 text-secondary hover:text-foreground transition-colors"
            >
              ← Back to {languageName}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = quizSession.questions[quizSession.currentIndex];
  const selectedOptionId = quizSession.answers.get(currentQuestion.flashcardId);
  const isLastQuestion = quizSession.currentIndex === quizSession.questions.length - 1;
  const timerColor = progressService.getTimerColor(quizTimeRemaining);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                    endQuiz();
                    router.push(`/languages/${slug}`);
                  }
                }}
                className="text-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <h1 className="text-xl font-bold">Quiz Mode</h1>
                  <p className="text-sm text-secondary">
                    Question {quizSession.currentIndex + 1} of {quizSession.questions.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-card-hover ${timerColor}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-mono font-bold text-lg">
                {progressService.formatTimer(quizTimeRemaining)}
              </span>
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
                width: `${((quizSession.currentIndex + 1) / quizSession.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <QuizCard
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
            showResult={currentAnswerRevealed}
          />

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={quizSession.currentIndex === 0}
              className="px-6 py-3 bg-card text-foreground rounded-lg font-semibold hover:bg-card-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">
                Answered: {quizSession.answers.size} / {quizSession.questions.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={!currentAnswerRevealed || isSubmitting}
              className="px-6 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : isLastQuestion ? (
                'Submit Quiz'
              ) : (
                'Next →'
              )}
            </button>
          </div>

          {/* Question Navigation Dots */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {quizSession.questions.map((q, index) => {
              const isAnswered = quizSession.answers.has(q.flashcardId);
              const isCurrent = index === quizSession.currentIndex;

              return (
                <button
                  key={q.flashcardId}
                  onClick={() => {
                    if (index < quizSession.currentIndex || isAnswered) {
                      // Allow going back or to answered questions
                      const diff = index - quizSession.currentIndex;
                      if (diff < 0) {
                        for (let i = 0; i < Math.abs(diff); i++) previousQuestion();
                      } else {
                        for (let i = 0; i < diff; i++) nextQuestion();
                      }
                      setCurrentAnswerRevealed(isAnswered);
                    }
                  }}
                  className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-primary text-background'
                      : isAnswered
                      ? 'bg-primary/20 text-primary'
                      : 'bg-card-hover text-secondary'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
