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
      className={`bg-card border border-card-hover rounded-xl p-6 hover:bg-card-hover transition-all group hover:border-primary/50 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icon}</div>
          <div>
            <h4 className="text-xl font-semibold">{language.name}</h4>
            <p className="text-sm text-secondary">
              {language.totalKeywords} keywords
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {language.isGenerated ? (
            <div className="w-3 h-3 bg-primary rounded-full group-hover:scale-110 transition-transform"></div>
          ) : (
            <div className="w-3 h-3 bg-secondary/30 rounded-full"></div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-secondary">{progress}%</span>
        </div>
        {onClick && (
          <button className="text-primary text-sm font-medium hover:text-primary-hover">
            {language.isGenerated ? 'Practice' : 'Generate'} →
          </button>
        )}
      </div>

      {!language.isGenerated && (
        <div className="mt-4 text-xs text-secondary bg-background px-3 py-2 rounded-lg">
          Flashcards not generated yet
        </div>
      )}
    </div>
  );
}
