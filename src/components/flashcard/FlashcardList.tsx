'use client';

import { Flashcard } from '@/types/flashcard';
import FlashcardCard from './FlashcardCard';

interface FlashcardListProps {
  flashcards: Flashcard[];
  isLoading?: boolean;
}

export default function FlashcardList({
  flashcards,
  isLoading,
}: FlashcardListProps) {
  if (isLoading || !flashcards) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-card-hover rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-background rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-background rounded w-32 mb-2"></div>
                <div className="h-3 bg-background rounded w-20"></div>
              </div>
            </div>
            <div className="h-4 bg-background rounded w-full mb-2"></div>
            <div className="h-4 bg-background rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">No flashcards found</h3>
        <p className="text-secondary">
          Try adjusting your search or generate flashcards for this language
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {flashcards.map((flashcard) => (
        <FlashcardCard key={flashcard._id} flashcard={flashcard} />
      ))}
    </div>
  );
}
