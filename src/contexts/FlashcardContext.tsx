'use client';

import React, { createContext, useContext, useState } from 'react';
import { flashcardService } from '@/services/flashcard.service';
import { Flashcard, FlashcardStats } from '@/types/flashcard';
import { LanguageSlug } from '@/types/language';

interface FlashcardContextType {
  flashcards: Flashcard[];
  stats: FlashcardStats | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  currentLanguage: string | null;
  searchQuery: string;
  sortBy: 'keyword' | 'newest' | 'oldest';
  generateFlashcards: (slug: LanguageSlug) => Promise<{ success: boolean; message: string }>;
  fetchFlashcards: (slug: LanguageSlug) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'keyword' | 'newest' | 'oldest') => void;
  getFilteredFlashcards: () => Flashcard[];
  shuffleCards: () => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'keyword' | 'newest' | 'oldest'>('keyword');

  const generateFlashcards = async (slug: LanguageSlug) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await flashcardService.generateFlashcards(slug);

      if (response.success && response.data) {
        return {
          success: true,
          message: `Successfully generated ${response.data.totalGenerated} flashcards!`,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to generate flashcards',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to generate flashcards',
      };
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchFlashcards = async (slug: LanguageSlug) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await flashcardService.getFlashcards(slug);

      if (response.success && response.data) {
        const cards = response.data.flashcards;
        setAllFlashcards(cards);
        setFlashcards(cards);
        setCurrentLanguage(response.data.language);
        setStats(flashcardService.calculateStats(cards));
      } else {
        setError(response.message || 'Failed to fetch flashcards');
        setFlashcards([]);
        setAllFlashcards([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch flashcards'
      );
      setFlashcards([]);
      setAllFlashcards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredFlashcards = () => {
    let filtered = allFlashcards;

    // Apply search filter
    if (searchQuery) {
      filtered = flashcardService.searchFlashcards(filtered, searchQuery);
    }

    // Apply sorting
    filtered = flashcardService.sortFlashcards(filtered, sortBy);

    return filtered;
  };

  const shuffleCards = () => {
    const shuffled = flashcardService.shuffleFlashcards(allFlashcards);
    setFlashcards(shuffled);
  };

  // Update filtered flashcards when search or sort changes
  React.useEffect(() => {
    const filtered = getFilteredFlashcards();
    setFlashcards(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy]);

  const value: FlashcardContextType = {
    flashcards,
    stats,
    isLoading,
    isGenerating,
    error,
    currentLanguage,
    searchQuery,
    sortBy,
    generateFlashcards,
    fetchFlashcards,
    setSearchQuery,
    setSortBy,
    getFilteredFlashcards,
    shuffleCards,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
