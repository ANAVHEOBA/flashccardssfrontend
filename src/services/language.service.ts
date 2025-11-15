// Language Service - API calls for language operations

import { apiClient, ApiResponse } from '@/lib/api';
import {
  Language,
  LanguagesResponse,
  SupportedLanguagesResponse,
  SingleLanguageResponse,
  LanguageSlug,
  LanguageStats,
} from '@/types/language';

export const languageService = {
  /**
   * Get all supported languages from the system
   * Returns languages with their keywords
   */
  async getSupportedLanguages(): Promise<
    ApiResponse<SupportedLanguagesResponse>
  > {
    return apiClient.get<SupportedLanguagesResponse>(
      '/api/languages/supported',
      true
    );
  },

  /**
   * Get all languages from database with generation status
   */
  async getAllLanguages(): Promise<ApiResponse<LanguagesResponse>> {
    return apiClient.get<LanguagesResponse>('/api/languages', true);
  },

  /**
   * Get specific language by slug
   */
  async getLanguageBySlug(
    slug: LanguageSlug
  ): Promise<ApiResponse<SingleLanguageResponse>> {
    return apiClient.get<SingleLanguageResponse>(
      `/api/languages/${slug}`,
      true
    );
  },

  /**
   * Calculate language statistics
   */
  calculateStats(languages: Language[]): LanguageStats {
    const totalKeywords = languages.reduce(
      (sum, lang) => sum + lang.totalKeywords,
      0
    );
    const generatedCount = languages.filter((lang) => lang.isGenerated).length;

    return {
      totalLanguages: languages.length,
      totalKeywords,
      generatedCount,
      pendingCount: languages.length - generatedCount,
    };
  },

  /**
   * Get language icon emoji by slug
   */
  getLanguageIcon(slug: string): string {
    const icons: Record<string, string> = {
      python: '🐍',
      javascript: '⚡',
      java: '☕',
      typescript: '💙',
      cpp: '⚙️',
      go: '🔷',
      rust: '🦀',
      c: '🔧',
      kotlin: '🎯',
    };

    return icons[slug] || '💻';
  },

  /**
   * Sort languages by different criteria
   */
  sortLanguages(
    languages: Language[],
    sortBy: 'name' | 'keywords' | 'generated' = 'name'
  ): Language[] {
    const sorted = [...languages];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'keywords':
        return sorted.sort((a, b) => b.totalKeywords - a.totalKeywords);
      case 'generated':
        return sorted.sort((a, b) => {
          if (a.isGenerated === b.isGenerated) return 0;
          return a.isGenerated ? -1 : 1;
        });
      default:
        return sorted;
    }
  },

  /**
   * Filter languages by generation status
   */
  filterLanguages(
    languages: Language[],
    filter: 'all' | 'generated' | 'pending'
  ): Language[] {
    switch (filter) {
      case 'generated':
        return languages.filter((lang) => lang.isGenerated);
      case 'pending':
        return languages.filter((lang) => !lang.isGenerated);
      default:
        return languages;
    }
  },
};
