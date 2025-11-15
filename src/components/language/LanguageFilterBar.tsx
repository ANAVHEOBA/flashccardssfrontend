'use client';

interface LanguageFilterBarProps {
  currentFilter: 'all' | 'generated' | 'pending';
  currentSort: 'name' | 'keywords' | 'generated';
  onFilterChange: (filter: 'all' | 'generated' | 'pending') => void;
  onSortChange: (sort: 'name' | 'keywords' | 'generated') => void;
}

export default function LanguageFilterBar({
  currentFilter,
  currentSort,
  onFilterChange,
  onSortChange,
}: LanguageFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary mr-2">Filter:</span>
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'all'
              ? 'bg-primary text-background'
              : 'bg-card text-secondary hover:bg-card-hover'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('generated')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'generated'
              ? 'bg-primary text-background'
              : 'bg-card text-secondary hover:bg-card-hover'
          }`}
        >
          Generated
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'pending'
              ? 'bg-primary text-background'
              : 'bg-card text-secondary hover:bg-card-hover'
          }`}
        >
          Pending
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary mr-2">Sort by:</span>
        <select
          value={currentSort}
          onChange={(e) =>
            onSortChange(e.target.value as 'name' | 'keywords' | 'generated')
          }
          className="px-4 py-2 bg-card border border-card-hover rounded-lg text-sm font-medium hover:bg-card-hover transition-colors focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="name">Name</option>
          <option value="keywords">Keywords Count</option>
          <option value="generated">Generation Status</option>
        </select>
      </div>
    </div>
  );
}
