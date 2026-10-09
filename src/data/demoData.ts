import type { MessageOrigin } from '@/types';

const TODAY = new Date();

function addHours(n: number): number {
  return TODAY.getTime() - n * 3600 * 1000;
}

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
  origin: MessageOrigin;
  packageName: string | null;
}

export const DEMO_MESSAGES: RawMessage[] = [
  // --- Original demo messages (manual/demo origin) ---
  {
    source: 'Canvas Portal',
    title: 'Assignment Submission Window Closing',
    body: 'Reminder: Your Data Structures lab report is due tonight at 11:59 PM. Late submissions lose 15% per day. Please upload your PDF to the Assignment 7 dropbox before the deadline.',
    timestamp: addHours(2),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'College Admin',
    title: 'Tuition Payment Deadline',
    body: 'URGENT: Your fall semester tuition payment of $4,200 is overdue by 3 days. A late fee of $150 will be applied if payment is not received by Friday. Contact the bursar office immediately.',
    timestamp: addHours(5),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'CS Study Group',
    title: 'Group Study Session Tomorrow',
    body: "Hey everyone! Let's meet at the library tomorrow at 3 PM in study room 204B to review for the algorithms midterm. Bring your notes from chapters 5-8. Sarah will bring practice problems.",
    timestamp: addHours(8),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Prof. Chen',
    title: 'Office Hours Moved',
    body: 'My office hours this week are moved to Thursday 2-4 PM instead of Wednesday. Same room, Science Building 312. Please come with specific questions about the recursion assignment.',
    timestamp: addDays(-1),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Gmail',
    title: 'Library Book Overdue Notice',
    body: 'You have 2 overdue books: "Clean Code" (5 days late) and "Design Patterns" (2 days late). Total fine: $3.50. Please return them at your earliest convenience to avoid additional charges.',
    timestamp: addHours(27),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Dorm Group Chat',
    title: 'Movie Night This Weekend',
    body: "Who's down for movie night on Saturday? Thinking we order pizza and watch something fun. Vote in the poll by Thursday so we can plan. No pressure though!",
    timestamp: addHours(30),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Career Services',
    title: 'Internship Application Window Open',
    body: 'The Google Summer Internship application is now open for software engineering roles. Deadline is November 15. Required: resume, transcript, and cover letter. Strongly recommend applying early as applications are reviewed on a rolling basis.',
    timestamp: addDays(-2),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Student Union',
    title: 'Spring Club Fair Sign-Up',
    body: 'The spring club fair is happening next Wednesday in the main quad from 10 AM to 2 PM. Over 40 clubs will be there. Sign up early to get a free t-shirt and lunch voucher!',
    timestamp: addHours(52),
    origin: 'demo',
    packageName: null,
  },
  {
    source: 'Roommate Alex',
    title: 'Groceries This Week?',
    body: "Hey are we splitting groceries this week? I need to grab some stuff from Trader Joe's. Let me know if you want anything and I'll pick it up.",
    timestamp: addDays(-3),
    origin: 'demo',
    packageName: null,
  },

  // --- Android notification demo messages ---
  {
    source: 'WhatsApp',
    title: 'Mom',
    body: 'Call me back when you get this, it\'s important about your grandmother\'s surgery tomorrow. Need to confirm you can pick her up at 8 AM.',
    timestamp: addHours(0.5),
    origin: 'demo',
    packageName: 'com.whatsapp',
  },
  {
    source: 'Gmail',
    title: 'professor.patel@university.edu',
    body: 'Subject: Exam rescheduled. Dear students, the algorithms exam scheduled for Wednesday has been moved to Friday at 10 AM in Hall B. Please confirm you received this update.',
    timestamp: addHours(1),
    origin: 'demo',
    packageName: 'com.google.android.gm',
  },
  {
    source: 'College App',
    title: 'Campus Connect',
    body: 'URGENT: Your dorm room maintenance request has been approved. Maintenance will enter your room tomorrow between 9 AM and 11 AM. Please secure any valuables.',
    timestamp: addHours(1.5),
    origin: 'demo',
    packageName: 'edu.university.campusconnect',
  },
  {
    source: 'Instagram',
    title: 'New message from sarah_designs',
    body: 'haha that meme was so funny 😂 also are we still on for the study group thursday?',
    timestamp: addHours(3),
    origin: 'demo',
    packageName: 'com.instagram.android',
  },
  {
    source: 'WhatsApp',
    title: 'Class Group (47 members)',
    body: 'Jake: Hey guys the professor just posted the study guide on canvas. Make sure to download it before the exam. Also reminder that office hours are tomorrow at 2!',
    timestamp: addHours(4),
    origin: 'demo',
    packageName: 'com.whatsapp',
  },
  {
    source: 'Gmail',
    title: 'no-reply@scholarshipportal.org',
    body: 'Subject: Scholarship deadline approaching. Your scholarship application is incomplete. 2 of 3 required documents are missing. The deadline is this Friday at 5 PM. Login to upload your remaining documents.',
    timestamp: addHours(6),
    origin: 'demo',
    packageName: 'com.google.android.gm',
  },
  {
    source: 'Instagram',
    title: 'Notifications',
    body: '3 people you follow posted new stories. Tap to view.',
    timestamp: addHours(10),
    origin: 'demo',
    packageName: 'com.instagram.android',
  },
  {
    source: 'WhatsApp',
    title: 'Dorm Floor Chat',
    body: 'Alex: anyone want to order pizza tonight? I found a coupon for 30% off if we order before 8 PM',
    timestamp: addHours(12),
    origin: 'demo',
    packageName: 'com.whatsapp',
  },
];
