import type { Category, Priority } from '@/types';

export const CATEGORY_CONFIG: Record<Category, {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}> = {
  urgent: {
    label: 'Urgent',
    shortLabel: 'Urgent',
    color: 'red',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  tasks: {
    label: 'Tasks & Deadlines',
    shortLabel: 'Tasks',
    color: 'amber',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  meetings: {
    label: 'Meetings & Reminders',
    shortLabel: 'Meetings',
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  important: {
    label: 'Important Messages',
    shortLabel: 'Important',
    color: 'violet',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  general: {
    label: 'General / Casual',
    shortLabel: 'General',
    color: 'slate',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  bg: string;
  text: string;
  border: string;
  ring: string;
}> = {
  high: {
    label: 'High',
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    ring: 'ring-red-400',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
  },
  low: {
    label: 'Low',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
    ring: 'ring-slate-400',
  },
};

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
