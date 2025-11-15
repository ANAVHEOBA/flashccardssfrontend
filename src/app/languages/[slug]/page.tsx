'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguages } from '@/contexts/LanguageContext';
import { useFlashcards } from '@/contexts/FlashcardContext';
import FlashcardList from '@/components/flashcard/FlashcardList';
import FlashcardSearchBar from '@/components/flashcard/FlashcardSearchBar';
import { LanguageSlug } from '@/types/language';
import { languageService } from '@/services/language.service';

export default function LanguageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as LanguageSlug;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { selectedLanguage, selectLanguage } = useLanguages();
  const {
    flashcards,
    isLoading,
    isGenerating,
    error,
    searchQuery,
    sortBy,
    fetchFlashcards,
    generateFlashcards,
    setSearchQuery,
    setSortBy,
    shuffleCards,
  } = useFlashcards();

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && slug) {
      selectLanguage(slug);
      fetchFlashcards(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, slug]);

  const handleGenerateFlashcards = async () => {
    const result = await generateFlashcards(slug);
    if (result.success) {
      // Refresh flashcards after generation
      await fetchFlashcards(slug);
      setShowGenerateModal(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const languageIcon = languageService.getLanguageIcon(slug);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/languages')}
                className="text-secondary hover:text-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1
                onClick={() => router.push('/')}
                className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              >
                Flashcards<span className="text-primary">.ai</span>
              </h1>
            </div>
            <nav className="flex gap-6">
              <button
                onClick={() => router.push('/')}
                className="text-secondary hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/languages')}
                className="text-secondary hover:text-foreground transition-colors"
              >
                Languages
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Language Header */}
      <section className="bg-card border-b border-card-hover">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{languageIcon}</div>
              <div>
                <h2 className="text-3xl font-bold">
                  {selectedLanguage?.name || slug}
                </h2>
                <p className="text-secondary mt-1">
                  {selectedLanguage?.totalKeywords || 0} keywords •{' '}
                  {flashcards.length} flashcards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedLanguage?.isGenerated ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Generated</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Generate Flashcards
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!error && flashcards.length > 0 && (
          <>
            <FlashcardSearchBar
              searchQuery={searchQuery}
              sortBy={sortBy}
              totalCount={flashcards.length}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onShuffle={shuffleCards}
            />
            <FlashcardList flashcards={flashcards} isLoading={isLoading} />
          </>
        )}

        {!error && !isLoading && flashcards.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-3">No Flashcards Yet</h3>
            <p className="text-secondary mb-6">
              Generate flashcards to start learning {selectedLanguage?.name || slug}{' '}
              keywords
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              Generate Flashcards
            </button>
          </div>
        )}
      </section>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-card-hover rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">
              Generate <span className="text-primary">Flashcards</span>
            </h3>
            <p className="text-secondary mb-6">
              This will generate {selectedLanguage?.totalKeywords || 0} flashcards
              for {selectedLanguage?.name || slug} keywords using AI. This may take
              1-2 minutes.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateFlashcards}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-card-hover text-foreground rounded-lg font-semibold hover:bg-background transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
