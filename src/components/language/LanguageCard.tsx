'use client';

import { Language } from '@/types/language';
import { languageService } from '@/services/language.service';

interface LanguageCardProps {
  language: Language;
  progress?: number;
  onClick?: (language: Language) => void;
}

export default function LanguageCard({
  language,
  progress = 0,
  onClick,
}: LanguageCardProps) {
  const icon = languageService.getLanguageIcon(language.slug);

  return (
    <div
      onClick={() => onClick?.(language)}
      className={`bg-card border border-card-hover rounded-xl p-4 md:p-6 hover:bg-card-hover transition-all group hover:border-primary/50 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-3xl md:text-4xl">{icon}</div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold">{language.name}</h4>
            <p className="text-xs md:text-sm text-secondary">
              {language.totalKeywords} keywords
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {language.isGenerated ? (
            <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full group-hover:scale-110 transition-transform"></div>
          ) : (
            <div className="w-2 h-2 md:w-3 md:h-3 bg-secondary/30 rounded-full"></div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 md:mt-6">
        <div className="flex items-center gap-2">
          <div className="w-24 md:w-32 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-secondary">{progress}%</span>
        </div>
        {onClick && (
          <button className="text-primary text-xs md:text-sm font-medium hover:text-primary-hover whitespace-nowrap">
            {language.isGenerated ? 'Practice' : 'Generate'} →
          </button>
        )}
      </div>

      {!language.isGenerated && (
        <div className="mt-3 md:mt-4 text-xs text-secondary bg-background px-2 md:px-3 py-1.5 md:py-2 rounded-lg">
          Flashcards not generated yet
        </div>
      )}
    </div>
  );
}
