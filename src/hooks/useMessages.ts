import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Message, Category, Priority } from '@/types';
import { loadMessages, saveMessages, loadSettings, saveSettings, clearMessages } from '@/lib/storage';
import { DEMO_MESSAGES } from '@/data/demoData';
import { processMessage } from '@/lib/messageEngine';

function createDemoMessages(): Message[] {
  return DEMO_MESSAGES.map(d =>
    processMessage(d.source, d.title, d.body, d.timestamp, d.isDemo),
  );
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState(loadSettings);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage or demo data
  useEffect(() => {
    const stored = loadMessages();
    if (stored && stored.length > 0) {
      setMessages(stored);
    } else {
      const demos = createDemoMessages();
      setMessages(demos);
      saveMessages(demos);
    }
    setInitialized(true);
  }, []);

  // Persist messages on change
  useEffect(() => {
    if (initialized) saveMessages(messages);
  }, [messages, initialized]);

  const addMessage = useCallback((source: string, title: string, body: string) => {
    const processed = processMessage(source, title, body, Date.now(), false);
    setMessages(prev => [processed, ...prev]);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)),
    );
  }, []);

  const updatePriority = useCallback((id: string, priority: Priority) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, priority, priorityReason: 'Manually adjusted by you' }
          : m,
      ),
    );
  }, []);

  const resetToDemo = useCallback(() => {
    clearMessages();
    const demos = createDemoMessages();
    setMessages(demos);
    saveMessages(demos);
  }, []);

  const clearAll = useCallback(() => {
    setMessages([]);
    clearMessages();
  }, []);

  const dismissPrivacy = useCallback(() => {
    const next = { ...settings, dismissedPrivacy: true };
    setSettings(next);
    saveSettings(next);
  }, [settings]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      // Completed at bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then by priority
      const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pDiff !== 0) return pDiff;
      // Then by timestamp (newest first)
      return b.timestamp - a.timestamp;
    });
  }, [messages]);

  const stats = useMemo(() => {
    const active = messages.filter(m => !m.completed);
    const byCategory: Record<Category, number> = {
      urgent: 0, tasks: 0, meetings: 0, important: 0, general: 0,
    };
    const byPriority: Record<Priority, number> = { high: 0, medium: 0, low: 0 };
    for (const m of active) {
      byCategory[m.category]++;
      byPriority[m.priority]++;
    }
    return {
      total: active.length,
      completed: messages.filter(m => m.completed).length,
      byCategory,
      byPriority,
    };
  }, [messages]);

  return {
    messages: sortedMessages,
    allMessages: messages,
    stats,
    initialized,
    addMessage,
    deleteMessage,
    toggleComplete,
    updatePriority,
    resetToDemo,
    clearAll,
    settings,
    dismissPrivacy,
  };
}
