import { useState, useMemo } from 'react';
import { Inbox } from 'lucide-react';
import type { Category, Priority } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { FilterBar } from '@/components/FilterBar';
import { MessageCard } from '@/components/MessageCard';
import { AddMessageForm } from '@/components/AddMessageForm';
import { PrivacyNotice, PrivacyFooter } from '@/components/PrivacyNotice';

type CategoryFilter = Category | 'all';
type PriorityFilter = Priority | 'all';

function App() {
  const {
    messages,
    stats,
    addMessage,
    deleteMessage,
    toggleComplete,
    updatePriority,
    resetToDemo,
    clearAll,
    settings,
    dismissPrivacy,
  } = useMessages();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activePriority, setActivePriority] = useState<PriorityFilter>('all');

  const filtered = useMemo(() => {
    return messages.filter(m => {
      if (activeCategory !== 'all' && m.category !== activeCategory) return false;
      if (activePriority !== 'all' && m.priority !== activePriority) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${m.title} ${m.body} ${m.source} ${m.summary}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [messages, activeCategory, activePriority, search]);

  // Top messages for dashboard highlights
  const highPriorityMessages = useMemo(
    () => messages.filter(m => m.priority === 'high' && !m.completed).slice(0, 3),
    [messages],
  );

  const pendingTasks = useMemo(
    () => messages.filter(m => (m.category === 'tasks' || m.category === 'urgent') && !m.completed).slice(0, 5),
    [messages],
  );

  const recentMessages = useMemo(
    () => messages.slice(0, 4),
    [messages],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        onResetDemo={resetToDemo}
        onClearAll={clearAll}
        messageCount={messages.length}
      />

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        {/* Privacy notice */}
        {!settings.dismissedPrivacy && <PrivacyNotice onDismiss={dismissPrivacy} />}

        {/* Stats dashboard */}
        <StatsBar
          total={stats.total}
          completed={stats.completed}
          byCategory={stats.byCategory}
          byPriority={stats.byPriority}
        />

        {/* Dashboard highlights */}
        {highPriorityMessages.length > 0 && (
          <section className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-700">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
              High Priority Now
            </h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {highPriorityMessages.map(m => (
                <div key={m.id} className="rounded-xl border border-red-100 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{m.title}</p>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{m.summary}</p>
                  <p className="mt-1.5 text-xs font-medium text-red-500">{m.deadline || m.priorityReason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {pendingTasks.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">Pending Tasks & Deadlines</h2>
            <div className="space-y-2">
              {pendingTasks.map(m => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
                  <button
                    onClick={() => toggleComplete(m.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      m.completed
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-slate-300 hover:border-violet-400'
                    }`}
                  >
                    {m.completed && '✓'}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium text-slate-800 ${m.completed ? 'line-through' : ''}`}>
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-400">{m.source}</p>
                  </div>
                  {m.deadline && (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      {m.deadline}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Add message */}
        <AddMessageForm onAdd={addMessage} />

        {/* Filters */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
          categoryCounts={stats.byCategory}
        />

        {/* Message list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700">
                {activeCategory === 'all' && activePriority === 'all' && !search
                  ? 'All messages'
                  : `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}`}
              </h2>
              <span className="text-xs text-slate-400">Sorted by priority</span>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {filtered.map(m => (
                <MessageCard
                  key={m.id}
                  message={m}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteMessage}
                  onPriorityChange={updatePriority}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <Inbox size={28} />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">No messages found</p>
            <p className="mt-1 text-xs text-slate-400">
              {search || activeCategory !== 'all' || activePriority !== 'all'
                ? 'Try adjusting your filters'
                : 'Add a message above to get started'}
            </p>
          </div>
        )}

        {/* Recent messages summary (when no filters active) */}
        {recentMessages.length > 0 && activeCategory === 'all' && activePriority === 'all' && !search && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">Recent Activity</h2>
            <div className="space-y-2">
              {recentMessages.map(m => (
                <div key={m.id} className="flex items-center gap-3 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${
                    m.priority === 'high' ? 'bg-red-500' : m.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{m.title}</p>
                    <p className="text-xs text-slate-400">{m.source}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <PrivacyFooter />
      </main>
    </div>
  );
}

export default App;
