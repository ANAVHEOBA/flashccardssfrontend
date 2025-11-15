'use client';

interface FlashcardSearchBarProps {
  searchQuery: string;
  sortBy: 'keyword' | 'newest' | 'oldest';
  totalCount: number;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'keyword' | 'newest' | 'oldest') => void;
  onShuffle?: () => void;
}

export default function FlashcardSearchBar({
  searchQuery,
  sortBy,
  totalCount,
  onSearchChange,
  onSortChange,
  onShuffle,
}: FlashcardSearchBarProps) {
  return (
    <div className="bg-card border border-card-hover rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search keywords, questions, or answers..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-hover rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Sort and Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'keyword' | 'newest' | 'oldest')
            }
            className="px-4 py-2 bg-background border border-card-hover rounded-lg text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="keyword">Sort by Keyword</option>
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          {onShuffle && (
            <button
              onClick={onShuffle}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
              title="Shuffle flashcards"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Shuffle
            </button>
          )}

          <div className="px-4 py-2 bg-background border border-card-hover rounded-lg text-sm font-medium">
            <span className="text-primary font-semibold">{totalCount}</span>
            <span className="text-secondary ml-1">cards</span>
          </div>
        </div>
      </div>
    </div>
  );
}
