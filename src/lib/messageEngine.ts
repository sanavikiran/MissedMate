import type { Category, Priority, Message } from '@/types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'shall', 'to', 'of', 'in',
  'on', 'at', 'by', 'for', 'with', 'about', 'from', 'as', 'into', 'your',
  'you', 'we', 'our', 'us', 'i', 'me', 'my', 'it', 'its', 'this', 'that',
  'these', 'those', 'and', 'or', 'but', 'not', 'no', 'so', 'if', 'then',
  'than', 'too', 'very', 'just', 'also', 'only', 'up', 'out', 'over',
  'please', 'let', 'know', 'hey', 'hi', 'hello', 'bring', 'come', 'want',
  'think', 'need', 'like', 'get', 'got', 'go', 'going', 'one', 'two',
]);

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
  'return', 'pay', 'payment', 'fine', 'submit', 'due',
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

interface DateExtraction {
  deadline: string | null;
  urgencyHours: number | null;
  hasImminentDeadline: boolean;
}

function extractDates(text: string): DateExtraction {
  const lower = text.toLowerCase();
  const now = new Date();
  let deadline: string | null = null;
  let urgencyHours: number | null = null;
  let hasImminentDeadline = false;

  // Time patterns
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
      if (p.hours <= 24) hasImminentDeadline = true;
      break;
    }
  }

  // "at X PM/AM" time extraction
  const atTimeMatch = lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (atTimeMatch) {
    const hour = parseInt(atTimeMatch[1]);
    const minute = atTimeMatch[2] ? parseInt(atTimeMatch[2]) : 0;
    const period = atTimeMatch[3];
    let adjustedHour = hour;
    if (period === 'pm' && hour !== 12) adjustedHour += 12;
    if (period === 'am' && hour === 12) adjustedHour = 0;
    if (deadline) {
      deadline += ` at ${hour}:${minute.toString().padStart(2, '0')} ${period.toUpperCase()}`;
    }
    // If today and time is close, flag urgent
    if (!urgencyHours || urgencyHours >= 24) {
      // keep existing
    }
  }

  // "due in X days/hours"
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
    if (hours <= 24) hasImminentDeadline = true;
  }

  // "due tonight" / "due today"
  if (/\bdue\s+(tonight|today|tomorrow)\b/i.test(lower)) {
    hasImminentDeadline = true;
    urgencyHours = urgencyHours === null ? 12 : Math.min(urgencyHours, 12);
    deadline = deadline || 'today';
  }

  // "by Friday" / "by [day]"
  const byDayMatch = lower.match(/\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tonight|tomorrow|end of (?:day|week))\b/i);
  if (byDayMatch) {
    const dayLabel = byDayMatch[1];
    if (dayLabel === 'tonight') {
      hasImminentDeadline = true;
      urgencyHours = urgencyHours === null ? 8 : Math.min(urgencyHours, 8);
      deadline = deadline || 'tonight';
    } else if (dayLabel === 'tomorrow') {
      urgencyHours = urgencyHours === null ? 24 : Math.min(urgencyHours, 24);
      deadline = deadline || 'tomorrow';
    }
  }

  // "November 15" style dates
  const monthDateMatch = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (monthDateMatch) {
    deadline = deadline || `${monthDateMatch[1]} ${monthDateMatch[2]}`;
    // Try to compute rough hours
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

  // "X days late" / "overdue by X days"
  const lateMatch = lower.match(/\b(\d+)\s+days?\s+(?:late|overdue)\b/);
  if (lateMatch) {
    hasImminentDeadline = true;
    urgencyHours = 0;
    deadline = 'overdue';
  }

  // "overdue" alone
  if (/\boverdue\b/i.test(lower)) {
    hasImminentDeadline = true;
    urgencyHours = 0;
    deadline = 'overdue';
  }

  return { deadline, urgencyHours, hasImminentDeadline };
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

export function categorize(text: string): Category {
  const lower = text.toLowerCase();
  const { hasImminentDeadline } = extractDates(text);

  const urgencyScore = countMatches(lower, URGENCY_WORDS);
  const taskScore = countMatches(lower, TASK_WORDS);
  const meetingScore = countMatches(lower, MEETING_WORDS);
  const importantScore = countMatches(lower, IMPORTANT_WORDS);

  // Urgent: explicit urgency words or overdue/imminent
  if (urgencyScore >= 1 || hasImminentDeadline) {
    // If it's about a meeting/event AND not truly urgent (no "urgent", "overdue", "deadline")
    if (urgencyScore >= 2) return 'urgent';
    if (/\b(urgent|overdue|immediately|emergency|critical|final notice|warning)\b/i.test(lower)) {
      return 'urgent';
    }
    if (/\bdeadline\b/i.test(lower) && taskScore >= 1) return 'urgent';
    if (hasImminentDeadline && (urgencyScore >= 1 || /\bdeadline|due\b/i.test(lower))) {
      return 'urgent';
    }
  }

  // Tasks & Deadlines
  if (taskScore >= 2) return 'tasks';
  if (taskScore >= 1 && /\b(due|submit|deadline|complete|finish|return|pay)\b/i.test(lower)) {
    return 'tasks';
  }

  // Meetings & Reminders
  if (meetingScore >= 2) return 'meetings';
  if (meetingScore >= 1 && /\b(at|room|where|location|meet)\b/i.test(lower)) {
    return 'meetings';
  }

  // Important Messages
  if (importantScore >= 1) return 'important';

  // Default
  return 'general';
}

export function prioritize(
  text: string,
  category: Category,
): { priority: Priority; reason: string } {
  const lower = text.toLowerCase();
  const { urgencyHours, hasImminentDeadline } = extractDates(text);
  const urgencyScore = countMatches(lower, URGENCY_WORDS);

  const reasons: string[] = [];

  // High priority conditions
  if (urgencyScore >= 2) {
    reasons.push('multiple urgent indicators in the message');
  }
  if (urgencyHours !== null && urgencyHours <= 0) {
    reasons.push('the deadline has already passed');
  } else if (urgencyHours !== null && urgencyHours <= 24) {
    reasons.push('the deadline is within 24 hours');
  } else if (urgencyHours !== null && urgencyHours <= 48) {
    reasons.push('the deadline is within 2 days');
  }
  if (category === 'urgent') {
    reasons.push('this message is classified as urgent');
  }
  if (/\b(fine|fee|penalty|lose|losing)\b/i.test(lower) && /\b(\d+%|\$[\d,]+)\b/i.test(lower)) {
    reasons.push('there are financial consequences mentioned');
  }

  if (reasons.length >= 1) {
    return { priority: 'high', reason: capitalize(reasons[0]) + (reasons.length > 1 ? `, and ${reasons.slice(1).join(', ')}` : '') };
  }

  // Medium priority conditions
  const medReasons: string[] = [];
  if (urgencyHours !== null && urgencyHours <= 168) {
    medReasons.push('the deadline is within a week');
  }
  if (category === 'tasks') {
    medReasons.push('this is a task or deadline that needs attention');
  }
  if (category === 'meetings') {
    medReasons.push('this is a meeting or event you should attend');
  }
  if (category === 'important') {
    medReasons.push('this message contains important updates');
  }
  if (/\b(required|mandatory|must|should|recommend)\b/i.test(lower)) {
    medReasons.push('an action or response may be expected');
  }

  if (medReasons.length >= 1) {
    return { priority: 'medium', reason: capitalize(medReasons[0]) };
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
  const lower = text.toLowerCase();
  const items: string[] = [];

  // "Please [verb]" patterns
  const pleaseMatch = text.match(/please\s+([^.!]+)[.!]/gi);
  if (pleaseMatch) {
    for (const m of pleaseMatch.slice(0, 2)) {
      items.push(m.replace(/please\s+/i, '').replace(/[.!]/g, '').trim());
    }
  }

  // "You need to" / "You must" / "You should"
  const needMatch = text.match(/(?:you\s+)?(?:need to|must|should|have to)\s+([^.!]+)/gi);
  if (needMatch) {
    for (const m of needMatch.slice(0, 2)) {
      const cleaned = m.replace(/(?:you\s+)?(?:need to|must|should|have to)\s+/i, '').trim();
      if (cleaned.length > 5) items.push(cleaned);
    }
  }

  // "Bring X" / "Upload X" / "Submit X" / "Return X" / "Pay X" / "Contact X" / "Register X" / "Apply"
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

  // Dedupe and limit
  return items.slice(0, 3).map(i => i.charAt(0).toUpperCase() + i.slice(1));
}

export function summarize(text: string): string {
  // Extract the most important sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);

  if (sentences.length === 0) return text.trim().slice(0, 200);

  if (sentences.length === 1) {
    return sentences[0].slice(0, 200);
  }

  // Score sentences by presence of key information
  const keyWords = [...URGENCY_WORDS, ...TASK_WORDS, ...IMPORTANT_WORDS, 'due', 'deadline', 'room', 'at', 'by', 'fee', 'fine'];
  const scored = sentences.map(s => {
    let score = 0;
    const lower = s.toLowerCase();
    for (const kw of keyWords) {
      if (lower.includes(kw)) score += 1;
    }
    // Prefer shorter sentences slightly
    if (s.length < 120) score += 1;
    // First sentence gets slight boost (often contains the main point)
    return { sentence: s, score, index: sentences.indexOf(s) };
  });

  // Pick top 1-2 sentences
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  const topSentences = scored.filter(s => s.score > 0).slice(0, 2);
  if (topSentences.length === 0) {
    // Fall back to first sentence
    return sentences[0].slice(0, 200);
  }

  // Re-sort by original order
  topSentences.sort((a, b) => a.index - b.index);
  return topSentences.map(s => s.sentence).join('. ').slice(0, 300) + '.';
}

export function processMessage(
  source: string,
  title: string,
  body: string,
  timestamp: number,
  isDemo: boolean,
): Message {
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
    isDemo,
  };
}
