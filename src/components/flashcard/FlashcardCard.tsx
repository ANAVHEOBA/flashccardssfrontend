'use client';

import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';

interface FlashcardCardProps {
  flashcard: Flashcard;
  showAnswer?: boolean;
}

export default function FlashcardCard({
  flashcard,
  showAnswer = false,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(showAnswer);
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-card border border-card-hover rounded-xl p-6 hover:border-primary/30 transition-all">
      {/* Keyword Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-mono font-semibold">
              {flashcard.keyword.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-mono">
              {flashcard.keyword}
            </h3>
            <p className="text-xs text-secondary">Keyword</p>
          </div>
        </div>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {isFlipped ? 'Hide' : 'Show'} Answer
        </button>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-sm text-secondary mb-2">Question:</p>
        <p className="text-foreground">{flashcard.question}</p>
      </div>

      {/* Answer (Collapsible) */}
      {isFlipped && (
        <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-secondary mb-2">Answer:</p>
          <p className="text-foreground">{flashcard.answer}</p>
        </div>
      )}

      {/* Code Example Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
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
          Code Example
        </button>

        {showCode && (
          <pre className="mt-3 p-4 bg-background border border-card-hover rounded-lg overflow-x-auto">
            <code className="text-sm font-mono text-primary">
              {flashcard.codeExample}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
