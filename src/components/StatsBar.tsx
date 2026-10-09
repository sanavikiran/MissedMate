import { AlertTriangle, CheckCircle2, ListTodo, Inbox } from 'lucide-react';
import type { Category, Priority } from '@/types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/lib/uiConfig';

interface Props {
  total: number;
  completed: number;
  byCategory: Record<Category, number>;
  byPriority: Record<Priority, number>;
}

export function StatsBar({ total, completed, byCategory, byPriority }: Props) {
  const highCount = byPriority.high;

  const cards = [
    {
      label: 'High Priority',
      value: highCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      ring: 'ring-red-100',
    },
    {
      label: 'Pending Tasks',
      value: byCategory.tasks + byCategory.urgent,
      icon: ListTodo,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-100',
    },
    {
      label: 'Total Active',
      value: total,
      icon: Inbox,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      ring: 'ring-violet-100',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      ring: 'ring-green-100',
    },
  ];

  const categories: Category[] = ['urgent', 'tasks', 'meetings', 'important', 'general'];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category breakdown bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold text-slate-400">Notifications by category</p>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {categories.map(cat => {
            const count = byCategory[cat];
            const pct = total > 0 ? (count / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={cat}
                className={CATEGORY_CONFIG[cat].dot}
                style={{ width: `${pct}%` }}
                title={`${CATEGORY_CONFIG[cat].label}: ${count}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {categories.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                <span className="text-xs text-slate-500">{config.shortLabel}</span>
                <span className="text-xs font-semibold text-slate-700">{byCategory[cat]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
