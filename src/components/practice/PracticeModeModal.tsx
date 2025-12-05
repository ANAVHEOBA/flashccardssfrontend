'use client';

import { useState } from 'react';

interface PracticeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFlashcard: () => void;
  onSelectQuiz: (questionCount: number) => void;
  languageName: string;
}

const QUESTION_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export default function PracticeModeModal({
  isOpen,
  onClose,
  onSelectFlashcard,
  onSelectQuiz,
  languageName,
}: PracticeModeModalProps) {
  const [selectedMode, setSelectedMode] = useState<'flashcard' | 'quiz' | null>(null);
  const [questionCount, setQuestionCount] = useState(10);

  if (!isOpen) return null;

  const handleStart = () => {
    if (selectedMode === 'flashcard') {
      onSelectFlashcard();
    } else if (selectedMode === 'quiz') {
      onSelectQuiz(questionCount);
    }
  };

  const handleClose = () => {
    setSelectedMode(null);
    setQuestionCount(10);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-card border border-card-hover rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-secondary hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Start Practice</h2>
          <p className="text-secondary">Choose how you want to practice {languageName}</p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-4 mb-6">
          {/* Flashcard Option */}
          <button
            onClick={() => setSelectedMode('flashcard')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedMode === 'flashcard'
                ? 'border-primary bg-primary/10'
                : 'border-card-hover hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${selectedMode === 'flashcard' ? 'bg-primary/20' : 'bg-card-hover'}`}>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Flashcards</h3>
                <p className="text-secondary text-sm mb-3">
                  Free response practice. Type your answer, reveal the correct one, and self-assess.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-card-hover rounded text-xs text-secondary">No timer</span>
                  <span className="px-2 py-1 bg-card-hover rounded text-xs text-secondary">Self-paced</span>
                  <span className="px-2 py-1 bg-card-hover rounded text-xs text-secondary">10 cards</span>
                </div>
              </div>
              {selectedMode === 'flashcard' && (
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>

          {/* Quiz Option */}
          <button
            onClick={() => setSelectedMode('quiz')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedMode === 'quiz'
                ? 'border-primary bg-primary/10'
                : 'border-card-hover hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${selectedMode === 'quiz' ? 'bg-primary/20' : 'bg-card-hover'}`}>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Quiz</h3>
                <p className="text-secondary text-sm mb-3">
                  Multiple choice questions. Pick the correct answer from 5 options.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">10 min timer</span>
                  <span className="px-2 py-1 bg-card-hover rounded text-xs text-secondary">5 options</span>
                  <span className="px-2 py-1 bg-card-hover rounded text-xs text-secondary">Graded</span>
                </div>
              </div>
              {selectedMode === 'quiz' && (
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Question Count Selector (Quiz only) */}
        {selectedMode === 'quiz' && (
          <div className="mb-6 p-4 bg-background rounded-lg border border-card-hover">
            <label className="block text-sm font-medium mb-3">Number of Questions</label>
            <div className="grid grid-cols-5 gap-2">
              {QUESTION_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                    questionCount === count
                      ? 'bg-primary text-background'
                      : 'bg-card-hover text-secondary hover:text-foreground'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="text-xs text-secondary mt-3">
              All questions must be completed within 10 minutes
            </p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!selectedMode}
          className="w-full px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {selectedMode === 'quiz'
            ? `Start Quiz (${questionCount} Questions)`
            : selectedMode === 'flashcard'
            ? 'Start Flashcards'
            : 'Select a mode to continue'}
        </button>
      </div>
    </div>
  );
}
