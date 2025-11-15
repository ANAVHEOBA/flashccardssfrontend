// Flashcard Service - API calls for flashcard operations

import { apiClient, ApiResponse } from '@/lib/api';
import {
  Flashcard,
  GenerateFlashcardsResponse,
  GetFlashcardsResponse,
  FlashcardStats,
} from '@/types/flashcard';
import { LanguageSlug } from '@/types/language';

export const flashcardService = {
  /**
   * Generate flashcards for a language (Public endpoint)
   */
  async generateFlashcards(
    slug: LanguageSlug
  ): Promise<ApiResponse<GenerateFlashcardsResponse>> {
    return apiClient.post<GenerateFlashcardsResponse>(
      `/api/flashcards/generate/${slug}`,
      {},
      false // Not authenticated
    );
  },

  /**
   * Get all flashcards for a language (Protected endpoint)
   */
  async getFlashcards(
    slug: LanguageSlug
  ): Promise<ApiResponse<GetFlashcardsResponse>> {
    return apiClient.get<GetFlashcardsResponse>(
      `/api/flashcards/${slug}`,
      true // Requires authentication
    );
  },

  /**
   * Calculate flashcard statistics
   */
  calculateStats(flashcards: Flashcard[]): FlashcardStats {
    return {
      total: flashcards.length,
      practiced: 0, // Will be updated when we integrate progress API
      mastered: 0,
      remaining: flashcards.length,
    };
  },

  /**
   * Shuffle flashcards for practice
   */
  shuffleFlashcards(flashcards: Flashcard[]): Flashcard[] {
    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Search flashcards by keyword
   */
  searchFlashcards(flashcards: Flashcard[], query: string): Flashcard[] {
    const lowercaseQuery = query.toLowerCase();
    return flashcards.filter(
      (card) =>
        card.keyword.toLowerCase().includes(lowercaseQuery) ||
        card.question.toLowerCase().includes(lowercaseQuery) ||
        card.answer.toLowerCase().includes(lowercaseQuery)
    );
  },

  /**
   * Sort flashcards by different criteria
   */
  sortFlashcards(
    flashcards: Flashcard[],
    sortBy: 'keyword' | 'newest' | 'oldest' = 'keyword'
  ): Flashcard[] {
    const sorted = [...flashcards];

    switch (sortBy) {
      case 'keyword':
        return sorted.sort((a, b) => a.keyword.localeCompare(b.keyword));
      case 'newest':
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return sorted;
    }
  },

  /**
   * Format code example for display
   */
  formatCodeExample(code: string): string {
    return code.replace(/\\n/g, '\n');
  },
};
