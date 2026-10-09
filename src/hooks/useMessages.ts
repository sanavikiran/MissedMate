import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Message, Category, Priority, Settings } from '@/types';
import { loadMessages, saveMessages, loadSettings, saveSettings, clearMessages } from '@/lib/storage';
import { DEMO_MESSAGES } from '@/data/demoData';
import { processMessage } from '@/lib/messageEngine';

function createDemoMessages(): Message[] {
  return DEMO_MESSAGES.map(d =>
    processMessage({
      source: d.source,
      title: d.title,
      body: d.body,
      timestamp: d.timestamp,
      origin: d.origin,
      packageName: d.packageName,
    }),
  );
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const s = loadSettings();
    return {
      theme: 'light',
      dismissedPrivacy: false,
      androidConnected: false,
      listenerEnabled: false,
      excludedApps: [],
      ...s,
    };
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = loadMessages();
    if (stored && stored.length > 0) {
      // Migrate old messages that lack the `origin` field
      const migrated = stored.map(m => ({
        ...m,
        origin: (m as Message & { origin?: string }).origin ?? (m.isDemo ? 'demo' : 'manual'),
        packageName: m.packageName ?? null,
        appIcon: m.appIcon ?? null,
        notificationId: m.notificationId ?? null,
      }));
      setMessages(migrated);
    } else {
      const demos = createDemoMessages();
      setMessages(demos);
      saveMessages(demos);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) saveMessages(messages);
  }, [messages, initialized]);

  useEffect(() => {
    if (initialized) saveSettings(settings);
  }, [settings, initialized]);

  const addMessage = useCallback((source: string, title: string, body: string) => {
    const processed = processMessage({
      source, title, body, timestamp: Date.now(), origin: 'manual',
    });
    setMessages(prev => [processed, ...prev]);
  }, []);

  const addNotification = useCallback((params: {
    source: string;
    title: string;
    body: string;
    packageName: string;
    notificationId: number;
  }) => {
    const processed = processMessage({
      source: params.source,
      title: params.title,
      body: params.body,
      timestamp: Date.now(),
      origin: 'android',
      packageName: params.packageName,
      notificationId: params.notificationId,
    });
    setMessages(prev => {
      // Replace if same notificationId exists (update case)
      const filtered = prev.filter(m => m.notificationId !== params.notificationId);
      return [processed, ...filtered];
    });
  }, []);

  const removeNotification = useCallback((notificationId: number) => {
    setMessages(prev => prev.filter(m => m.notificationId !== notificationId));
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
    setSettings(prev => ({ ...prev, dismissedPrivacy: true }));
  }, []);

  const setAndroidConnected = useCallback((connected: boolean) => {
    setSettings(prev => ({
      ...prev,
      androidConnected: connected,
      listenerEnabled: connected ? prev.listenerEnabled : false,
    }));
  }, []);

  const setListenerEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, listenerEnabled: enabled }));
  }, []);

  const toggleAppExclusion = useCallback((packageName: string) => {
    setSettings(prev => {
      const excluded = prev.excludedApps.includes(packageName)
        ? prev.excludedApps.filter(p => p !== packageName)
        : [...prev.excludedApps, packageName];
      return { ...prev, excludedApps: excluded };
    });
  }, []);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pDiff !== 0) return pDiff;
      return b.timestamp - a.timestamp;
    });
  }, [messages]);

  const filteredByExclusion = useMemo(() => {
    if (settings.excludedApps.length === 0) return sortedMessages;
    return sortedMessages.filter(
      m => !m.packageName || !settings.excludedApps.includes(m.packageName),
    );
  }, [sortedMessages, settings.excludedApps]);

  const stats = useMemo(() => {
    const active = filteredByExclusion.filter(m => !m.completed);
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
      completed: filteredByExclusion.filter(m => m.completed).length,
      byCategory,
      byPriority,
    };
  }, [filteredByExclusion]);

  return {
    messages: filteredByExclusion,
    allMessages: messages,
    stats,
    initialized,
    settings,
    addMessage,
    addNotification,
    removeNotification,
    deleteMessage,
    toggleComplete,
    updatePriority,
    resetToDemo,
    clearAll,
    dismissPrivacy,
    setAndroidConnected,
    setListenerEnabled,
    toggleAppExclusion,
  };
}
