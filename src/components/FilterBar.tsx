import { Search, X } from 'lucide-react';
import type { Category, Priority } from '@/types';
import { CategoryChip } from './CategoryChip';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/lib/uiConfig';

interface Props {
  search: string;
  onSearchChange: (s: string) => void;
  activeCategory: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  activePriority: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  categoryCounts: Record<Category, number>;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export function FilterBar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activePriority,
  onPriorityChange,
  categoryCounts,
}: Props) {
  const categories: Category[] = ['urgent', 'tasks', 'meetings', 'important', 'general'];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search messages..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <CategoryChip
            key={cat}
            category={cat}
            count={categoryCounts[cat]}
            active={activeCategory === cat}
            onClick={() => onCategoryChange(activeCategory === cat ? 'all' : cat)}
          />
        ))}
      </div>

      {/* Priority filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Priority:</span>
        <button
          onClick={() => onPriorityChange('all')}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
            activePriority === 'all'
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
          }`}
        >
          All
        </button>
        {PRIORITIES.map(p => {
          const config = PRIORITY_CONFIG[p];
          return (
            <button
              key={p}
              onClick={() => onPriorityChange(activePriority === p ? 'all' : p)}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
                activePriority === p
                  ? `${config.bg} ${config.text} ${config.border} shadow-sm`
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
