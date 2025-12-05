'use client';

import { QuizSessionStats } from '@/types/progress';
import { progressService } from '@/services/progress.service';

interface QuizResultsProps {
  stats: QuizSessionStats;
  onRetry: () => void;
  onFinish: () => void;
}

export default function QuizResults({ stats, onRetry, onFinish }: QuizResultsProps) {
  const getGrade = (accuracy: number): { grade: string; color: string; message: string } => {
    if (accuracy >= 90) return { grade: 'A', color: 'text-green-400', message: 'Excellent!' };
    if (accuracy >= 80) return { grade: 'B', color: 'text-blue-400', message: 'Great job!' };
    if (accuracy >= 70) return { grade: 'C', color: 'text-yellow-400', message: 'Good effort!' };
    if (accuracy >= 60) return { grade: 'D', color: 'text-orange-400', message: 'Keep practicing!' };
    return { grade: 'F', color: 'text-red-400', message: 'Try again!' };
  };

  const { grade, color, message } = getGrade(stats.accuracy);
  const timeFormatted = progressService.formatDuration(stats.timeUsedSeconds);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-card border border-card-hover rounded-2xl p-8 text-center">
        {/* Expired Warning */}
        {stats.expired && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-semibold">Time expired!</p>
            <p className="text-sm text-red-400/80">Your quiz was auto-submitted.</p>
          </div>
        )}

        {/* Grade */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-card-hover border-4 ${color.replace(
              'text-',
              'border-'
            )}`}
          >
            <span className={`text-5xl font-bold ${color}`}>{grade}</span>
          </div>
        </div>

        {/* Message */}
        <h2 className={`text-2xl font-bold mb-2 ${color}`}>{message}</h2>
        <p className="text-secondary mb-8">Quiz completed</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-background rounded-lg p-4">
            <p className="text-3xl font-bold text-primary">{Math.round(stats.accuracy)}%</p>
            <p className="text-sm text-secondary">Accuracy</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-3xl font-bold text-foreground">{timeFormatted}</p>
            <p className="text-sm text-secondary">Time Used</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-3xl font-bold text-green-400">{stats.correct}</p>
            <p className="text-sm text-secondary">Correct</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-3xl font-bold text-red-400">{stats.incorrect}</p>
            <p className="text-sm text-secondary">Incorrect</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-secondary mb-2">
            <span>Score</span>
            <span>
              {stats.correct} / {stats.total}
            </span>
          </div>
          <div className="w-full h-3 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${stats.accuracy}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 px-6 py-4 bg-card-hover text-foreground rounded-lg font-semibold hover:bg-card-hover/80 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onFinish}
            className="flex-1 px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
