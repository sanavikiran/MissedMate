export type Category =
  | 'urgent'
  | 'tasks'
  | 'meetings'
  | 'important'
  | 'general';

export type Priority = 'high' | 'medium' | 'low';

export type MessageOrigin = 'manual' | 'demo' | 'android';

export interface Message {
  id: string;
  source: string;
  title: string;
  body: string;
  timestamp: number;
  category: Category;
  priority: Priority;
  summary: string;
  priorityReason: string;
  actionItems: string[];
  deadline: string | null;
  completed: boolean;
  isDemo: boolean;
  origin: MessageOrigin;
  packageName: string | null;
  appIcon: string | null;
  notificationId: number | null;
}

export interface Settings {
  theme: 'light' | 'dark';
  dismissedPrivacy: boolean;
  androidConnected: boolean;
  listenerEnabled: boolean;
  excludedApps: string[];
}

export interface AppInfo {
  packageName: string;
  label: string;
  excluded: boolean;
}
