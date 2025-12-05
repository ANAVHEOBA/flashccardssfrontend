'use client';

import { useState, useEffect } from 'react';
import { PracticeFlashcard } from '@/types/progress';

interface PracticeCardProps {
  flashcard: PracticeFlashcard;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
  userAnswer?: boolean;
}

export default function PracticeCard({
  flashcard,
  onAnswer,
  isAnswered,
  userAnswer,
}: PracticeCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Reset state when flashcard changes
  useEffect(() => {
    setShowAnswer(isAnswered);
    setShowCode(false);
    setUserInput('');
  }, [flashcard._id, isAnswered]);

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
    setShowAnswer(true);
  };

  return (
    <div className="bg-card border border-card-hover rounded-2xl p-8">
      {/* Keyword Header */}
      <div className="mb-6">
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
          <span className="text-primary font-mono font-semibold text-lg">
            {flashcard.keyword}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">{flashcard.question}</h3>
      </div>

      {/* Answer Section */}
      {!showAnswer && !isAnswered ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="user-answer" className="block text-sm font-medium mb-2">
              Your Answer:
            </label>
            <textarea
              id="user-answer"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="w-full bg-background border border-card-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <p className="text-secondary text-sm">
            Type your answer above, then reveal to check:
          </p>
          <button
            onClick={handleReveal}
            className="w-full px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Reveal Answer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User's Answer (if they typed one) */}
          {userInput && (
            <div className="p-6 bg-card-hover border border-card-hover rounded-lg">
              <p className="text-sm text-secondary mb-2">Your Answer:</p>
              <p className="text-foreground leading-relaxed italic">{userInput}</p>
            </div>
          )}

          {/* Correct Answer */}
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-secondary mb-2">Correct Answer:</p>
            <p className="text-foreground leading-relaxed">{flashcard.answer}</p>
          </div>

          {/* Code Example */}
          <div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors mb-3"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showCode ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {showCode ? 'Hide' : 'Show'} Code Example
            </button>

            {showCode && (
              <pre className="p-4 bg-background border border-card-hover rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-primary">
                  {flashcard.codeExample}
                </code>
              </pre>
            )}
          </div>

          {/* Answer Buttons */}
          {!isAnswered && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/20 transition-colors"
              >
                I Got It Wrong
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 px-6 py-4 bg-primary/10 text-primary border border-primary/30 rounded-lg font-semibold hover:bg-primary/20 transition-colors"
              >
                I Got It Right
              </button>
            </div>
          )}

          {/* Result Display */}
          {isAnswered && userAnswer !== undefined && (
            <div
              className={`p-4 rounded-lg border ${
                userAnswer
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-red-500/10 border-red-500/30 text-red-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {userAnswer ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">Correct!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">Keep practicing!</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
