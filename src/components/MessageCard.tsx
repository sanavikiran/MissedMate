import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Trash2, Check, Clock,
  AlertTriangle, CalendarClock, Users, MessageSquare, Coffee, Sparkles,
} from 'lucide-react';
import type { Message, Category, Priority } from '@/types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG, formatRelativeTime } from '@/lib/uiConfig';
import { PrioritySelect } from './PrioritySelect';

const CATEGORY_ICONS: Record<Category, typeof AlertTriangle> = {
  urgent: AlertTriangle,
  tasks: CalendarClock,
  meetings: Users,
  important: MessageSquare,
  general: Coffee,
};

interface Props {
  message: Message;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, p: Priority) => void;
}

export function MessageCard({ message, onToggleComplete, onDelete, onPriorityChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const catConfig = CATEGORY_CONFIG[message.category];
  const priConfig = PRIORITY_CONFIG[message.priority];
  const CatIcon = CATEGORY_ICONS[message.category];

  return (
    <article
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        message.completed ? 'opacity-60' : ''
      } ${message.priority === 'high' && !message.completed ? 'border-l-4 border-l-red-400' : ''}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${catConfig.bg} ${catConfig.text}`}>
              <CatIcon size={12} />
              {catConfig.shortLabel}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priConfig.bg} ${priConfig.text} ${priConfig.border} border`}>
              {priConfig.label}
            </span>
            {message.isDemo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                <Sparkles size={10} />
                Demo
              </span>
            )}
            {message.deadline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                <Clock size={11} />
                {message.deadline}
              </span>
            )}
          </div>
          <h3 className={`text-sm font-semibold text-slate-900 ${message.completed ? 'line-through' : ''}`}>
            {message.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{message.source}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleComplete(message.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
              message.completed
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
            title={message.completed ? 'Mark as not done' : 'Mark as done'}
          >
            <Check size={15} />
          </button>
          <button
            onClick={() => onDelete(message.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 rounded-lg bg-slate-50 p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles size={12} className="text-violet-500" />
          <span className="text-xs font-semibold text-slate-500">AI Summary</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{message.summary}</p>
      </div>

      {/* Priority reason */}
      <div className="mt-2 flex items-start gap-1.5 px-1">
        <span className="text-xs font-medium text-slate-400">Why this priority:</span>
        <span className="text-xs text-slate-600">{message.priorityReason}</span>
      </div>

      {/* Action items */}
      {message.actionItems.length > 0 && !message.completed && (
        <div className="mt-3 border-t border-slate-100 pt-2">
          <p className="mb-1.5 text-xs font-semibold text-slate-400">Action items</p>
          <ul className="space-y-1">
            {message.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 text-slate-300">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand/collapse + footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs text-slate-400">{formatRelativeTime(message.timestamp)}</span>
        <div className="flex items-center gap-2">
          <PrioritySelect value={message.priority} onChange={p => onPriorityChange(message.id, p)} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-1 text-xs font-semibold text-slate-400">Full message</p>
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{message.body}</p>
        </div>
      )}
    </article>
  );
}
