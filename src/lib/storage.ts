import type { Message, Settings } from '@/types';

const MESSAGE_KEY = 'missedmate_messages_v2';
const SETTINGS_KEY = 'missedmate_settings_v2';

export function loadMessages(): Message[] | null {
  try {
    const raw = localStorage.getItem(MESSAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Message[];
  } catch {
    return null;
  }
}

export function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage full or unavailable
  }
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as Settings;
  } catch {
    // fall through to defaults
  }
  return {
    theme: 'light',
    dismissedPrivacy: false,
    androidConnected: false,
    listenerEnabled: false,
    excludedApps: [],
  };
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable
  }
}

export function clearMessages(): void {
  localStorage.removeItem(MESSAGE_KEY);
}

export function clearAllStorage(): void {
  localStorage.removeItem(MESSAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
