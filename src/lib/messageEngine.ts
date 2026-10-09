import type { Category, Priority, Message, MessageOrigin } from '@/types';

const URGENCY_WORDS = [
  'urgent', 'immediately', 'asap', 'overdue', 'critical', 'emergency',
  'deadline', 'tonight', 'now', 'warning', 'final notice', 'last chance',
  'closing', 'expires', 'expire',
];

const TASK_WORDS = [
  'assignment', 'submit', 'submission', 'homework', 'report', 'essay',
  'project', 'presentation', 'quiz', 'exam', 'test', 'midterm', 'final',
  'paper', 'draft', 'complete', 'finish', 'turn in', 'upload', 'dropbox',
  'apply', 'application', 'register', 'sign up', 'signup', 'enroll',
  'return', 'pay', 'payment', 'fine', 'due',
];

const MEETING_WORDS = [
  'meeting', 'meet', 'session', 'office hours', 'class', 'lecture',
  'seminar', 'workshop', 'review', 'study', 'group', 'gathering',
  'appointment', 'interview', 'fair', 'event', 'party', 'night',
  'lunch', 'dinner',
];

const IMPORTANT_WORDS = [
  'moved', 'changed', 'rescheduled', 'cancelled', 'canceled',
  'postponed', 'update', 'announcement', 'notice', 'reminder',
  'important', 'attention', 'required', 'mandatory', 'confirm',
  'response needed', 'action required',
];

const FINANCIAL_WORDS = ['fine', 'fee', 'penalty', 'charge', 'overdue', 'payment', 'tuition', 'bill'];
const SOCIAL_WORDS = ['hey', 'lol', 'haha', 'cool', 'nice', 'fun', 'party', 'movie', 'game', 'weekend', 'chill', 'down for'];
const ACTION_REQUIRED_WORDS = ['please', 'must', 'need to', 'required', 'mandatory', 'confirm', 'respond', 'reply', 'rsvp', 'vote'];
const REPLY_EXPECTED_WORDS = ['?', 'what do you think', 'let me know', 'reply', 'response', 'rsvp', 'vote', 'confirm'];

interface DateExtraction {
  deadline: string | null;
  urgencyHours: number | null;
  hasImminentDeadline: boolean;
  hasDeadline: boolean;
}

function extractDates(text: string): DateExtraction {
  const lower = text.toLowerCase();
  const now = new Date();
  let deadline: string | null = null;
  let urgencyHours: number | null = null;
  let hasImminentDeadline = false;
  let hasDeadline = false;

  const timePatterns: Array<{ regex: RegExp; hours: number; label: string }> = [
    { regex: /\btonight\b/i, hours: 8, label: 'tonight' },
    { regex: /\btomorrow\b/i, hours: 24, label: 'tomorrow' },
    { regex: /\bnext week\b/i, hours: 168, label: 'next week' },
    { regex: /\bthis week\b/i, hours: 72, label: 'this week' },
    { regex: /\bthis weekend\b/i, hours: 96, label: 'this weekend' },
    { regex: /\bweekend\b/i, hours: 96, label: 'the weekend' },
    { regex: /\bmonday\b/i, hours: 48, label: 'Monday' },
    { regex: /\btuesday\b/i, hours: 72, label: 'Tuesday' },
    { regex: /\bwednesday\b/i, hours: 96, label: 'Wednesday' },
    { regex: /\bthursday\b/i, hours: 120, label: 'Thursday' },
    { regex: /\bfriday\b/i, hours: 144, label: 'Friday' },
    { regex: /\bsaturday\b/i, hours: 168, label: 'Saturday' },
    { regex: /\bsunday\b/i, hours: 192, label: 'Sunday' },
  ];

  for (const p of timePatterns) {
    if (p.regex.test(lower)) {
      urgencyHours = urgencyHours === null ? p.hours : Math.min(urgencyHours, p.hours);
      deadline = deadline || p.label;
      hasDeadline = true;
      if (p.hours <= 24) hasImminentDeadline = true;
      break;
    }
  }

  const atTimeMatch = lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (atTimeMatch) {
    const hour = parseInt(atTimeMatch[1]);
    const minute = atTimeMatch[2] ? parseInt(atTimeMatch[2]) : 0;
    const period = atTimeMatch[3];
    if (deadline) {
      deadline += ` at ${hour}:${minute.toString().padStart(2, '0')} ${period.toUpperCase()}`;
    }
  }

  const dueInMatch = lower.match(/\bdue\s+in\s+(\d+)\s*(day|hour|week)s?\b/);
  if (dueInMatch) {
    const num = parseInt(dueInMatch[1]);
    const unit = dueInMatch[2];
    let hours: number;
    if (unit === 'hour') hours = num;
    else if (unit === 'day') hours = num * 24;
    else hours = num * 168;
    urgencyHours = urgencyHours === null ? hours : Math.min(urgencyHours, hours);
    deadline = deadline || `in ${num} ${unit}${num > 1 ? 's' : ''}`;
    hasDeadline = true;
    if (hours <= 24) hasImminentDeadline = true;
  }

  if (/\bdue\s+(tonight|today|tomorrow)\b/i.test(lower)) {
    hasImminentDeadline = true;
    hasDeadline = true;
    urgencyHours = urgencyHours === null ? 12 : Math.min(urgencyHours, 12);
    deadline = deadline || 'today';
  }

  const byDayMatch = lower.match(/\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tonight|tomorrow|end of (?:day|week))\b/i);
  if (byDayMatch) {
    const dayLabel = byDayMatch[1];
    hasDeadline = true;
    if (dayLabel === 'tonight') {
      hasImminentDeadline = true;
      urgencyHours = urgencyHours === null ? 8 : Math.min(urgencyHours, 8);
      deadline = deadline || 'tonight';
    } else if (dayLabel === 'tomorrow') {
      urgencyHours = urgencyHours === null ? 24 : Math.min(urgencyHours, 24);
      deadline = deadline || 'tomorrow';
    }
  }

  const monthDateMatch = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (monthDateMatch) {
    deadline = deadline || `${monthDateMatch[1]} ${monthDateMatch[2]}`;
    hasDeadline = true;
    const monthName = monthDateMatch[1];
    const dayNum = parseInt(monthDateMatch[2]);
    const year = now.getFullYear();
    const targetDate = new Date(year, getMonthIndex(monthName), dayNum);
    if (targetDate < now) targetDate.setFullYear(year + 1);
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (diffHours > 0 && diffHours < 24 * 30) {
      urgencyHours = urgencyHours === null ? diffHours : Math.min(urgencyHours, diffHours);
      if (diffHours <= 48) hasImminentDeadline = true;
    }
  }

  const lateMatch = lower.match(/\b(\d+)\s+days?\s+(?:late|overdue)\b/);
  if (lateMatch) {
    hasImminentDeadline = true;
    hasDeadline = true;
    urgencyHours = 0;
    deadline = 'overdue';
  }

  if (/\boverdue\b/i.test(lower)) {
    hasImminentDeadline = true;
    hasDeadline = true;
    urgencyHours = 0;
    deadline = 'overdue';
  }

  return { deadline, urgencyHours, hasImminentDeadline, hasDeadline };
}

function getMonthIndex(month: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(month);
}

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const w of words) {
    const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

function hasAny(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some(w => {
    const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    return regex.test(lower);
  });
}

export function categorize(text: string): Category {
  const lower = text.toLowerCase();
  const { hasImminentDeadline, hasDeadline } = extractDates(text);

  const urgencyScore = countMatches(lower, URGENCY_WORDS);
  const taskScore = countMatches(lower, TASK_WORDS);
  const meetingScore = countMatches(lower, MEETING_WORDS);
  const importantScore = countMatches(lower, IMPORTANT_WORDS);

  // Urgent: multiple urgency words, explicit urgent language, or imminent deadlines with task context
  if (urgencyScore >= 2) return 'urgent';
  if (hasAny(lower, ['urgent', 'overdue', 'immediately', 'emergency', 'critical', 'final notice'])) {
    return 'urgent';
  }
  if (hasImminentDeadline && (urgencyScore >= 1 || hasDeadline || taskScore >= 1)) {
    return 'urgent';
  }

  // Tasks & Deadlines: assignments, submissions, payments with deadlines
  if (taskScore >= 2) return 'tasks';
  if (taskScore >= 1 && hasDeadline) return 'tasks';
  if (taskScore >= 1 && hasAny(lower, ['due', 'submit', 'deadline', 'complete', 'finish', 'return', 'pay'])) {
    return 'tasks';
  }

  // Meetings & Reminders: scheduled events, gatherings
  if (meetingScore >= 2) return 'meetings';
  if (meetingScore >= 1 && hasAny(lower, ['at', 'room', 'where', 'location', 'meet'])) {
    return 'meetings';
  }

  // Important Messages: schedule changes, announcements requiring attention
  if (importantScore >= 1) return 'important';

  // Default
  return 'general';
}

export function prioritize(
  text: string,
  category: Category,
): { priority: Priority; reason: string } {
  const lower = text.toLowerCase();
  const { urgencyHours, hasImminentDeadline, hasDeadline } = extractDates(text);
  const urgencyScore = countMatches(lower, URGENCY_WORDS);
  const taskScore = countMatches(lower, TASK_WORDS);
  const hasFinancial = hasAny(lower, FINANCIAL_WORDS) && /\b(\d+%|\$[\d,]+|\d+\s*dollars?)\b/i.test(lower);
  const hasActionRequired = hasAny(lower, ACTION_REQUIRED_WORDS);
  const hasSocialContext = countMatches(lower, SOCIAL_WORDS) >= 2;
  const hasReplyExpected = hasAny(lower, REPLY_EXPECTED_WORDS);
  const isVeryShort = text.trim().length < 80;

  const highReasons: string[] = [];
  const medReasons: string[] = [];

  // --- HIGH PRIORITY ---
  // Overdue
  if (urgencyHours !== null && urgencyHours <= 0) {
    highReasons.push('the deadline has already passed');
  }

  // Imminent deadline (within 24h) with real task context
  if (urgencyHours !== null && urgencyHours > 0 && urgencyHours <= 24) {
    if (urgencyScore >= 1 || taskScore >= 1 || hasDeadline) {
      highReasons.push('the deadline is within 24 hours');
    } else if (hasImminentDeadline) {
      highReasons.push('this is time-sensitive with an imminent deadline');
    }
  }

  // Multiple urgency indicators
  if (urgencyScore >= 2) {
    highReasons.push('multiple urgency indicators in the message');
  }

  // Financial consequences with a deadline
  if (hasFinancial && (hasDeadline || urgencyHours !== null && urgencyHours <= 168)) {
    highReasons.push('there are financial consequences with an approaching deadline');
  }

  // Category urgent with real urgency context (not just the word "urgent" alone)
  if (category === 'urgent' && (hasImminentDeadline || urgencyScore >= 2 || hasFinancial)) {
    if (highReasons.length === 0) {
      highReasons.push('this message is classified as urgent based on its overall context');
    }
  }

  if (highReasons.length >= 1) {
    return { priority: 'high', reason: capitalize(highReasons[0]) + (highReasons.length > 1 ? `, and ${highReasons.slice(1).join(', ')}` : '') };
  }

  // --- MEDIUM PRIORITY ---
  // Deadline within a week
  if (urgencyHours !== null && urgencyHours > 24 && urgencyHours <= 168) {
    medReasons.push('the deadline is within a week');
  }

  // Task or assignment without imminent deadline
  if (category === 'tasks') {
    medReasons.push('this is a task or deadline that needs attention');
  }

  // Meeting or event
  if (category === 'meetings') {
    if (hasDeadline) {
      medReasons.push('this is a meeting or event with a scheduled time');
    } else {
      medReasons.push('this is a meeting or event you should attend');
    }
  }

  // Important updates (schedule changes, announcements)
  if (category === 'important') {
    medReasons.push('this message contains an important update or schedule change');
  }

  // Action required but no deadline urgency
  if (hasActionRequired && !hasImminentDeadline) {
    medReasons.push('an action or response is expected from you');
  }

  // Reply expected (questions, RSVP, votes)
  if (hasReplyExpected && !hasSocialContext) {
    medReasons.push('the sender is expecting a reply or confirmation');
  }

  // Explicit "important" word but without other urgency signals — still medium, not high
  if (urgencyScore === 1 && !hasImminentDeadline && !hasFinancial) {
    medReasons.push('the message mentions urgency but lacks an imminent deadline');
  }

  if (medReasons.length >= 1) {
    return { priority: 'medium', reason: capitalize(medReasons[0]) };
  }

  // --- LOW PRIORITY ---
  // Social/casual messages, very short messages with no action items
  if (hasSocialContext || (isVeryShort && !hasActionRequired && !hasDeadline)) {
    return {
      priority: 'low',
      reason: 'This appears to be a casual or social message with no deadlines or required actions',
    };
  }

  return {
    priority: 'low',
    reason: 'No urgent deadlines, required actions, or critical content detected',
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function extractActionItems(text: string): string[] {
  const items: string[] = [];

  const pleaseMatch = text.match(/please\s+([^.!]+)[.!]/gi);
  if (pleaseMatch) {
    for (const m of pleaseMatch.slice(0, 2)) {
      items.push(m.replace(/please\s+/i, '').replace(/[.!]/g, '').trim());
    }
  }

  const needMatch = text.match(/(?:you\s+)?(?:need to|must|should|have to)\s+([^.!]+)/gi);
  if (needMatch) {
    for (const m of needMatch.slice(0, 2)) {
      const cleaned = m.replace(/(?:you\s+)?(?:need to|must|should|have to)\s+/i, '').trim();
      if (cleaned.length > 5) items.push(cleaned);
    }
  }

  const actionVerbs = ['bring', 'upload', 'submit', 'return', 'pay', 'contact', 'register', 'apply', 'sign up', 'enroll', 'complete', 'finish', 'review', 'vote'];
  for (const verb of actionVerbs) {
    const regex = new RegExp(`\\b${verb}\\s+([^.!]+)`, 'i');
    const m = text.match(regex);
    if (m && items.length < 3) {
      const action = `${capitalize(verb)} ${m[1].trim()}`.replace(/[.!]/g, '').trim();
      if (!items.some(i => i.toLowerCase().includes(action.toLowerCase().slice(0, 15)))) {
        items.push(action);
      }
    }
  }

  return items.slice(0, 3).map(i => i.charAt(0).toUpperCase() + i.slice(1));
}

export function summarize(text: string): string {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);

  if (sentences.length === 0) return text.trim().slice(0, 200);
  if (sentences.length === 1) return sentences[0].slice(0, 200);

  const keyWords = [...URGENCY_WORDS, ...TASK_WORDS, ...IMPORTANT_WORDS, 'due', 'deadline', 'room', 'at', 'by', 'fee', 'fine'];
  const scored = sentences.map((s, i) => {
    let score = 0;
    const lower = s.toLowerCase();
    for (const kw of keyWords) {
      if (lower.includes(kw)) score += 1;
    }
    if (s.length < 120) score += 1;
    return { sentence: s, score, index: i };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  const topSentences = scored.filter(s => s.score > 0).slice(0, 2);
  if (topSentences.length === 0) return sentences[0].slice(0, 200);

  topSentences.sort((a, b) => a.index - b.index);
  return topSentences.map(s => s.sentence).join('. ').slice(0, 300) + '.';
}

interface ProcessParams {
  source: string;
  title: string;
  body: string;
  timestamp: number;
  origin: MessageOrigin;
  packageName?: string | null;
  notificationId?: number | null;
}

export function processMessage(params: ProcessParams): Message {
  const { source, title, body, timestamp, origin, packageName = null, notificationId = null } = params;
  const fullText = `${title} ${body}`;
  const category = categorize(fullText);
  const { priority, reason } = prioritize(fullText, category);
  const summary = summarize(body || title);
  const { deadline } = extractDates(fullText);
  const actionItems = extractActionItems(body);

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    source,
    title,
    body,
    timestamp,
    category,
    priority,
    summary,
    priorityReason: reason,
    actionItems,
    deadline,
    completed: false,
    isDemo: origin === 'demo',
    origin,
    packageName,
    appIcon: null,
    notificationId,
  };
}
