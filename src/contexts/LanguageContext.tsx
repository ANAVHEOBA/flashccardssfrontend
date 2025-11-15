'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { languageService } from '@/services/language.service';
import {
  Language,
  SupportedLanguage,
  LanguageStats,
  LanguageSlug,
} from '@/types/language';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  languages: Language[];
  supportedLanguages: SupportedLanguage[];
  stats: LanguageStats | null;
  isLoading: boolean;
  error: string | null;
  selectedLanguage: Language | null;
  fetchLanguages: () => Promise<void>;
  fetchSupportedLanguages: () => Promise<void>;
  selectLanguage: (slug: LanguageSlug) => Promise<void>;
  sortLanguages: (sortBy: 'name' | 'keywords' | 'generated') => void;
  filterLanguages: (filter: 'all' | 'generated' | 'pending') => void;
  currentFilter: 'all' | 'generated' | 'pending';
  currentSort: 'name' | 'keywords' | 'generated';
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [supportedLanguages, setSupportedLanguages] = useState<
    SupportedLanguage[]
  >([]);
  const [stats, setStats] = useState<LanguageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [currentFilter, setCurrentFilter] = useState<
    'all' | 'generated' | 'pending'
  >('all');
  const [currentSort, setCurrentSort] = useState<
    'name' | 'keywords' | 'generated'
  >('name');

  const fetchLanguages = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await languageService.getAllLanguages();

      if (response.success && response.data) {
        // response.data is already the Language[] array
        const langs = response.data;
        setAllLanguages(langs);
        setLanguages(langs);
        setStats(languageService.calculateStats(langs));
      } else {
        setError(response.message || 'Failed to fetch languages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupportedLanguages = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await languageService.getSupportedLanguages();

      if (response.success && response.data) {
        setSupportedLanguages(response.data.languages);
      }
    } catch (err) {
      console.error('Failed to fetch supported languages:', err);
    }
  };

  const selectLanguage = async (slug: LanguageSlug) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await languageService.getLanguageBySlug(slug);

      if (response.success && response.data) {
        setSelectedLanguage(response.data.language);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch language'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sortLanguages = (sortBy: 'name' | 'keywords' | 'generated') => {
    setCurrentSort(sortBy);
    const sorted = languageService.sortLanguages(allLanguages, sortBy);
    const filtered = languageService.filterLanguages(sorted, currentFilter);
    setLanguages(filtered);
  };

  const filterLanguages = (filter: 'all' | 'generated' | 'pending') => {
    setCurrentFilter(filter);
    const sorted = languageService.sortLanguages(allLanguages, currentSort);
    const filtered = languageService.filterLanguages(sorted, filter);
    setLanguages(filtered);
  };

  // Fetch languages when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchLanguages();
    } else {
      setLanguages([]);
      setAllLanguages([]);
      setSupportedLanguages([]);
      setStats(null);
      setSelectedLanguage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value: LanguageContextType = {
    languages,
    supportedLanguages,
    stats,
    isLoading,
    error,
    selectedLanguage,
    fetchLanguages,
    fetchSupportedLanguages,
    selectLanguage,
    sortLanguages,
    filterLanguages,
    currentFilter,
    currentSort,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguages() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguages must be used within a LanguageProvider');
  }
  return context;
}
