'use client';

import { PracticeSessionStats } from '@/types/progress';
import { progressService } from '@/services/progress.service';

interface SessionResultsProps {
  stats: PracticeSessionStats;
  onContinue: () => void;
  onFinish: () => void;
}

export default function SessionResults({
  stats,
  onContinue,
  onFinish,
}: SessionResultsProps) {
  const accuracyColor = progressService.getAccuracyColor(stats.accuracy);

  return (
    <div className="bg-card border border-card-hover rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {stats.accuracy >= 80 ? '🎉' : stats.accuracy >= 60 ? '👍' : '💪'}
        </div>
        <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
        <p className="text-secondary">
          {stats.duration && `Completed in ${progressService.formatDuration(stats.duration)}`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-background rounded-lg p-6 text-center">
          <div className={`text-4xl font-bold ${accuracyColor}`}>
            {Math.round(stats.accuracy)}%
          </div>
          <div className="text-sm text-secondary mt-2">Accuracy</div>
        </div>

        <div className="bg-background rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-secondary mt-2">Total Cards</div>
        </div>

        <div className="bg-background rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-primary">{stats.correct}</div>
          <div className="text-sm text-secondary mt-2">Correct</div>
        </div>

        <div className="bg-background rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-red-500">{stats.incorrect}</div>
          <div className="text-sm text-secondary mt-2">Incorrect</div>
        </div>
      </div>

      {/* Performance Message */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <p className="text-center text-foreground">
          {stats.accuracy >= 90
            ? "Excellent work! You're mastering these keywords! 🌟"
            : stats.accuracy >= 75
            ? "Great job! Keep up the good work! 💪"
            : stats.accuracy >= 50
            ? 'Good effort! Practice makes perfect! 📚'
            : "Don't give up! Review the material and try again! 🎯"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onContinue}
          className="flex-1 px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors"
        >
          Practice More
        </button>
        <button
          onClick={onFinish}
          className="flex-1 px-6 py-4 bg-card-hover text-foreground rounded-lg font-semibold hover:bg-background transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
