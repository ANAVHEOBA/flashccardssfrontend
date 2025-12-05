'use client';

import { Language } from '@/types/language';
import LanguageCard from './LanguageCard';

interface LanguageGridProps {
  languages: Language[];
  onLanguageClick?: (language: Language) => void;
  isLoading?: boolean;
}

export default function LanguageGrid({
  languages,
  onLanguageClick,
  isLoading,
}: LanguageGridProps) {
  if (isLoading || !languages) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-card-hover rounded-xl p-4 md:p-6 animate-pulse"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-background rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 md:h-6 bg-background rounded w-20 md:w-24 mb-2"></div>
                <div className="h-3 md:h-4 bg-background rounded w-24 md:w-32"></div>
              </div>
            </div>
            <div className="h-2 bg-background rounded w-full mt-4 md:mt-6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">No languages found</h3>
        <p className="text-sm md:text-base text-secondary">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {languages.map((language) => (
        <LanguageCard
          key={language._id}
          language={language}
          onClick={onLanguageClick}
        />
      ))}
    </div>
  );
}
