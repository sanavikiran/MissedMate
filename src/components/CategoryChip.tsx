import { AlertTriangle, CalendarClock, Users, MessageSquare, Coffee } from 'lucide-react';
import type { Category } from '@/types';
import { CATEGORY_CONFIG } from '@/lib/uiConfig';

const ICONS: Record<Category, typeof AlertTriangle> = {
  urgent: AlertTriangle,
  tasks: CalendarClock,
  meetings: Users,
  important: MessageSquare,
  general: Coffee,
};

interface Props {
  category: Category;
  count: number;
  active: boolean;
  onClick: () => void;
}

export function CategoryChip({ category, count, active, onClick }: Props) {
  const config = CATEGORY_CONFIG[category];
  const Icon = ICONS[category];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? `${config.bg} ${config.text} ${config.border} shadow-sm`
          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
      }`}
    >
      <Icon size={15} />
      <span>{config.shortLabel}</span>
      <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
        active ? `${config.text} bg-white/60` : 'bg-slate-100 text-slate-500'
      }`}>
        {count}
      </span>
    </button>
  );
}
