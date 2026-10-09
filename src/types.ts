export type Category =
  | 'urgent'
  | 'tasks'
  | 'meetings'
  | 'important'
  | 'general';

export type Priority = 'high' | 'medium' | 'low';

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
}

export interface Settings {
  theme: 'light' | 'dark';
  dismissedPrivacy: boolean;
}
