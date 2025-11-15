// Progress Service - API calls for progress tracking

import { apiClient, ApiResponse } from '@/lib/api';
import {
  GetPracticeFlashcardsResponse,
  SubmitPracticeRequest,
  SubmitPracticeResponse,
  LanguageProgress,
  ProgressSummary,
  PracticeSessionStats,
  MasteryLevel,
  MASTERY_LEVELS,
} from '@/types/progress';
import { LanguageSlug } from '@/types/language';

export const progressService = {
  /**
   * Get practice flashcards for a language
   */
  async getPracticeFlashcards(
    slug: LanguageSlug,
    limit: number = 10
  ): Promise<ApiResponse<GetPracticeFlashcardsResponse>> {
    return apiClient.get<GetPracticeFlashcardsResponse>(
      `/api/progress/practice/${slug}?limit=${limit}`,
      true
    );
  },

  /**
   * Submit practice session results
   */
  async submitPracticeResults(
    slug: LanguageSlug,
    results: SubmitPracticeRequest
  ): Promise<ApiResponse<SubmitPracticeResponse>> {
    return apiClient.post<SubmitPracticeResponse>(
      `/api/progress/practice/${slug}`,
      results,
      true
    );
  },

  /**
   * Get progress for a specific language
   */
  async getLanguageProgress(
    slug: LanguageSlug
  ): Promise<ApiResponse<LanguageProgress>> {
    return apiClient.get<LanguageProgress>(
      `/api/progress/language/${slug}`,
      true
    );
  },

  /**
   * Get overall progress summary
   */
  async getProgressSummary(): Promise<ApiResponse<ProgressSummary>> {
    return apiClient.get<ProgressSummary>('/api/progress/summary', true);
  },

  /**
   * Calculate session statistics
   */
  calculateSessionStats(
    results: Map<string, boolean>,
    startTime: Date,
    endTime?: Date
  ): PracticeSessionStats {
    const resultsArray = Array.from(results.values());
    const correct = resultsArray.filter((r) => r).length;
    const incorrect = resultsArray.filter((r) => !r).length;
    const total = resultsArray.length;

    const stats: PracticeSessionStats = {
      total,
      correct,
      incorrect,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
    };

    if (endTime) {
      stats.duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    }

    return stats;
  },

  /**
   * Determine mastery level based on accuracy and attempts
   */
  getMasteryLevel(accuracy: number, attempts: number): MasteryLevel {
    // Check from highest to lowest
    for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
      const level = MASTERY_LEVELS[i];
      if (attempts >= level.minAttempts && accuracy >= level.minAccuracy) {
        return level.level;
      }
    }
    return 'Beginner';
  },

  /**
   * Get mastery level color
   */
  getMasteryColor(level: MasteryLevel): string {
    const colors = {
      Beginner: 'text-secondary',
      Intermediate: 'text-yellow-500',
      Advanced: 'text-blue-500',
      Mastered: 'text-primary',
    };
    return colors[level];
  },

  /**
   * Get mastery level background color
   */
  getMasteryBgColor(level: MasteryLevel): string {
    const colors = {
      Beginner: 'bg-secondary/10',
      Intermediate: 'bg-yellow-500/10',
      Advanced: 'bg-blue-500/10',
      Mastered: 'bg-primary/10',
    };
    return colors[level];
  },

  /**
   * Calculate progress percentage for a language
   */
  calculateProgressPercentage(languageProgress: LanguageProgress): number {
    if (languageProgress.totalFlashcards === 0) return 0;
    return Math.round(
      (languageProgress.practiced / languageProgress.totalFlashcards) * 100
    );
  },

  /**
   * Format duration in seconds to readable string
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  },

  /**
   * Get accuracy color based on percentage
   */
  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 90) return 'text-primary';
    if (accuracy >= 75) return 'text-blue-500';
    if (accuracy >= 50) return 'text-yellow-500';
    return 'text-red-500';
  },
};
