'use client';

import { QuizQuestion } from '@/types/progress';

interface QuizCardProps {
  question: QuizQuestion;
  selectedOptionId: string | undefined;
  onSelectOption: (optionId: string) => void;
  showResult: boolean;
}

export default function QuizCard({
  question,
  selectedOptionId,
  onSelectOption,
  showResult,
}: QuizCardProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-card border border-card-hover rounded-2xl p-8">
      {/* Keyword Header */}
      <div className="mb-6">
        <p className="text-sm text-secondary mb-2">What does this keyword mean?</p>
        <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg">
          <span className="text-primary font-mono font-bold text-2xl">
            {question.keyword}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;

          let optionStyle = 'bg-background border-card-hover hover:border-primary/50';

          if (showResult) {
            if (isCorrect) {
              optionStyle = 'bg-green-500/10 border-green-500 text-green-400';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-red-500/10 border-red-500 text-red-400';
            } else {
              optionStyle = 'bg-background border-card-hover opacity-50';
            }
          } else if (isSelected) {
            optionStyle = 'bg-primary/10 border-primary';
          }

          return (
            <button
              key={option.id}
              onClick={() => !showResult && onSelectOption(option.id)}
              disabled={showResult}
              className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${
                !showResult ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    showResult && isCorrect
                      ? 'bg-green-500 text-white'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-primary text-background'
                      : 'bg-card-hover text-secondary'
                  }`}
                >
                  {optionLabels[index]}
                </span>
                <span className="text-foreground leading-relaxed pt-1">
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && selectedOptionId && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            selectedOptionId === question.correctOptionId
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {selectedOptionId === question.correctOptionId ? (
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
                <span className="font-semibold">Incorrect</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
