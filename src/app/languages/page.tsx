'use client';

import { useLanguages } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LanguageGrid from '@/components/language/LanguageGrid';
import LanguageStats from '@/components/language/LanguageStats';
import LanguageFilterBar from '@/components/language/LanguageFilterBar';
import { Language } from '@/types/language';

export default function LanguagesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    languages,
    stats,
    isLoading,
    error,
    currentFilter,
    currentSort,
    sortLanguages,
    filterLanguages,
  } = useLanguages();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLanguageClick = (language: Language) => {
    router.push(`/languages/${language.slug}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-card-hover">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <h1 className="text-xl md:text-2xl font-bold">
              Flashcards<span className="text-primary">.ai</span>
            </h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 md:py-20 text-center">
          <div className="animate-spin w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm md:text-base text-secondary mt-4">Loading languages...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover sticky top-0 bg-background z-40">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <h1
            onClick={() => router.push('/')}
            className="text-xl md:text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
          >
            Flashcards<span className="text-primary">.ai</span>
          </h1>
          <nav className="flex gap-3 md:gap-6">
            <button
              onClick={() => router.push('/')}
              className="text-sm md:text-base text-secondary hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button className="text-sm md:text-base text-primary font-medium">Languages</button>
          </nav>
        </div>
      </header>

      {/* Stats Bar */}
      <LanguageStats stats={stats} isLoading={isLoading} />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
            Choose Your <span className="text-primary">Language</span>
          </h2>
          <p className="text-secondary text-sm md:text-base lg:text-lg">
            Select a programming language to start learning its keywords
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <LanguageFilterBar
          currentFilter={currentFilter}
          currentSort={currentSort}
          onFilterChange={filterLanguages}
          onSortChange={sortLanguages}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Language Grid */}
        <LanguageGrid
          languages={languages}
          onLanguageClick={handleLanguageClick}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
