import type { Category, Priority } from '@/types';

const TODAY = new Date();

function addDays(n: number): number {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.getTime();
}

interface RawMessage {
  source: string;
  title: string;
  body: string;
  timestamp: number;
  isDemo: boolean;
}

export const DEMO_MESSAGES: RawMessage[] = [
  {
    source: 'Canvas Portal',
    title: 'Assignment Submission Window Closing',
    body: 'Reminder: Your Data Structures lab report is due tonight at 11:59 PM. Late submissions lose 15% per day. Please upload your PDF to the Assignment 7 dropbox before the deadline.',
    timestamp: addDays(0) - 2 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'College Admin',
    title: 'Tuition Payment Deadline',
    body: 'URGENT: Your fall semester tuition payment of $4,200 is overdue by 3 days. A late fee of $150 will be applied if payment is not received by Friday. Contact the bursar office immediately.',
    timestamp: addDays(0) - 5 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'CS Study Group',
    title: 'Group Study Session Tomorrow',
    body: 'Hey everyone! Let\'s meet at the library tomorrow at 3 PM in study room 204B to review for the algorithms midterm. Bring your notes from chapters 5-8. Sarah will bring practice problems.',
    timestamp: addDays(0) - 8 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'Prof. Chen',
    title: 'Office Hours Moved',
    body: 'My office hours this week are moved to Thursday 2-4 PM instead of Wednesday. Same room, Science Building 312. Please come with specific questions about the recursion assignment.',
    timestamp: addDays(-1),
    isDemo: true,
  },
  {
    source: 'Gmail',
    title: 'Library Book Overdue Notice',
    body: 'You have 2 overdue books: "Clean Code" (5 days late) and "Design Patterns" (2 days late). Total fine: $3.50. Please return them at your earliest convenience to avoid additional charges.',
    timestamp: addDays(-1) - 3 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'Dorm Group Chat',
    title: 'Movie Night This Weekend',
    body: 'Who\'s down for movie night on Saturday? Thinking we order pizza and watch something fun. Vote in the poll by Thursday so we can plan. No pressure though!',
    timestamp: addDays(-1) - 6 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'Career Services',
    title: 'Internship Application Window Open',
    body: 'The Google Summer Internship application is now open for software engineering roles. Deadline is November 15. Required: resume, transcript, and cover letter. Strongly recommend applying early as applications are reviewed on a rolling basis.',
    timestamp: addDays(-2),
    isDemo: true,
  },
  {
    source: 'Student Union',
    title: 'Spring Club Fair Sign-Up',
    body: 'The spring club fair is happening next Wednesday in the main quad from 10 AM to 2 PM. Over 40 clubs will be there. Sign up early to get a free t-shirt and lunch voucher!',
    timestamp: addDays(-2) - 4 * 3600 * 1000,
    isDemo: true,
  },
  {
    source: 'Roommate Alex',
    title: 'Groceries This Week?',
    body: 'Hey are we splitting groceries this week? I need to grab some stuff from Trader Joe\'s. Let me know if you want anything and I\'ll pick it up.',
    timestamp: addDays(-3),
    isDemo: true,
  },
];
