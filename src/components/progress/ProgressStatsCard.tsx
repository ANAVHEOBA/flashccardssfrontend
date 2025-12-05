'use client';

import { LanguageProgress } from '@/types/progress';
import { progressService } from '@/services/progress.service';

interface ProgressStatsCardProps {
  progress: LanguageProgress;
}

export default function ProgressStatsCard({ progress }: ProgressStatsCardProps) {
  const progressPercentage = progressService.calculateProgressPercentage(progress);
  const accuracyColor = progressService.getAccuracyColor(progress.averageAccuracy);

  return (
    <div className="bg-card border border-card-hover rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-secondary">Completion</span>
          <span className="text-sm font-semibold text-primary">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-3 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-secondary mt-2">
          {progress.practiced} of {progress.totalFlashcards} flashcards practiced
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background rounded-lg p-3">
          <div className={`text-2xl font-bold ${accuracyColor}`}>
            {progress.averageAccuracy}%
          </div>
          <div className="text-xs text-secondary mt-1">Accuracy</div>
        </div>

        <div className="bg-background rounded-lg p-3">
          <div className="text-2xl font-bold text-primary">
            {progress.mastered}
          </div>
          <div className="text-xs text-secondary mt-1">Mastered</div>
        </div>

        <div className="bg-background rounded-lg p-3">
          <div className="text-2xl font-bold text-primary">
            {progress.correct}
          </div>
          <div className="text-xs text-secondary mt-1">Correct</div>
        </div>

        <div className="bg-background rounded-lg p-3">
          <div className="text-2xl font-bold text-red-500">
            {progress.incorrect}
          </div>
          <div className="text-xs text-secondary mt-1">Incorrect</div>
        </div>
      </div>
    </div>
  );
}
