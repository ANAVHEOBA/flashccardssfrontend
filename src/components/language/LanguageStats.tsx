'use client';

import type { LanguageStats as LanguageStatsType } from '@/types/language';

interface LanguageStatsProps {
  stats: LanguageStatsType | null;
  isLoading?: boolean;
}

export default function LanguageStats({
  stats,
  isLoading,
}: LanguageStatsProps) {
  if (isLoading || !stats) {
    return (
      <section className="bg-card border-y border-card-hover">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-10 w-16 bg-background rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-background rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card border-y border-card-hover">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">
              {stats.totalLanguages}
            </div>
            <div className="text-sm text-secondary mt-1">Languages</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {stats.totalKeywords}
            </div>
            <div className="text-sm text-secondary mt-1">Flashcards</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {stats.generatedCount}
            </div>
            <div className="text-sm text-secondary mt-1">Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">
              {stats.pendingCount}
            </div>
            <div className="text-sm text-secondary mt-1">Pending</div>
          </div>
        </div>
      </div>
    </section>
  );
}
