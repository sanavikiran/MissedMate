# MissedMate — AI-Assisted Development Documentation

## 1. Project Overview

**Project Name:** MissedMate

**Problem Statement:**
Students receive notifications from multiple apps and often struggle to identify important announcements, deadlines, assignments, and personal messages among less important notifications.

**Proposed Solution:**
MissedMate is a student-focused notification management web application that organizes messages, identifies urgent items, and helps students decide what needs their attention first.

**Target Users:**
College students who want to manage messages, announcements, tasks, and deadlines more effectively.

### Proposed MVP Features

1. A dashboard displaying notifications and messages.
2. Manual message entry and sample notifications.
3. Automatic categorization into college, deadlines, personal, and general.
4. Priority labels such as High, Medium, and Low.
5. Sorting and filtering by category and priority.
6. A section highlighting urgent tasks and upcoming deadlines.
7. Options to mark messages as read or completed.
8. A clean, responsive interface suitable for desktop and mobile.

### Future Features

- Integration with supported email and messaging services.
- AI-powered message classification and summarization.
- Automatic deadline extraction.
- Reminders for important tasks.

These features are planned and must not be described as implemented until they have been built and verified.

## 2. Tech Stack and Architecture

### Proposed Tech Stack

- Frontend: React
- Programming Language: TypeScript
- Styling: Tailwind CSS
- Development Environment: Bolt.new
- Version Control: GitHub
- Data Storage: To be selected based on MVP requirements
- AI Integration: To be evaluated after the core application works

### Proposed Architecture

**User Interface:** Displays notifications, categories, priority levels, and action items.

**Message Management:** Supports adding messages and marking them as read or completed.

**Classification and Prioritization:** Uses transparent rules initially to assign categories and priorities.

**Data Layer:** Stores messages and their status using the selected storage solution.

**External Integrations:** Added only when supported APIs and appropriate authorization are available.

Important: A normal React web application cannot automatically read notifications from every installed mobile application. Each real integration requires an appropriate supported mechanism.

## 3. AI Code Generation Log

This document is created before application coding begins.

For each significant AI-assisted interaction, record:

- Date and time.
- Actual prompt or instruction.
- AI tool and model used.
- Purpose of the interaction.
- Files or components affected.
- Summary of the actual result.
- Verification status.

### Initial Planning Interaction

**AI Tool:** ChatGPT, GPT-6.

**Purpose:** Plan the project and establish an AI-assisted development workflow.

**Actual Instruction:** Help transform the project idea into a functional hackathon product, define the MVP, plan the architecture, document AI interactions, and maintain an accurate development log.

**Files Affected:** Initial documentation planning.

**Outcome:** Proposed MVP, architecture, and development workflow.

**Verification Status:** Planning completed; repository file creation and application implementation must be verified separately.

Do not fabricate additional prompts or claim that AI-generated code has been tested when it has not.

## 4. Debugging Log

No application debugging has been performed at the time of creating this document.

For each significant issue, record:

- The actual error message.
- Steps to reproduce the problem.
- The debugging prompt used.
- The AI tool and model used.
- The confirmed root cause, if known.
- The files modified.
- The implemented fix.
- The test performed and its observed result.

Only record verified outcomes as confirmed solutions.

## 5. AI Features and UI/UX Decisions

### Planned Intelligent Prioritization

Initially, use transparent rules to identify important messages based on factors such as:

- Explicit urgency.
- Deadlines and due dates.
- Important academic announcements.
- Action words such as submit, attend, or register.
- User-selected priority.

Do not classify a message as urgent based only on a single keyword when its context indicates otherwise.

### Planned AI Integration

AI may later help categorize messages, summarize long announcements, and identify deadlines.

Any AI integration must use an appropriate supported service and secure handling of credentials. Never expose secret API keys in frontend code or commit them to GitHub.

### Planned UI/UX

- Simple dashboard.
- Clear priority indicators.
- Separate category views.
- Search, sorting, and filtering.
- Mobile-responsive layout.
- Clear empty states and helpful error messages.

These are planned design decisions, not completed implementations.

## 6. Testing and Improvements

Testing has not started because application code has not yet been generated.

### Planned Tests

1. Add a new message successfully.
2. Validate empty or invalid message inputs.
3. Assign the correct category.
4. Assign and update priority levels.
5. Filter and sort messages.
6. Mark messages as read or completed.
7. Verify data persistence after refreshing.
8. Test empty inbox and error states.
9. Test the layout on desktop and mobile.
10. Test any implemented external integration and its authorization flow.

Record the actual test cases, expected results, observed results, and fixes.

Never claim that a test passed unless it was actually performed.

## 7. Final Summary

**Project Status:** Initial planning and documentation.

**AI Tools Used So Far:** ChatGPT for planning and documentation. Other tools must be recorded when actually used.

**Implemented Features:** None verified at this stage.

**Testing Status:** Not started.

**Planned Next Steps:**

1. Commit this file to the GitHub repository.
2. Confirm the MVP and architecture.
3. Generate the application code after approval.
4. Build the features incrementally using Bolt.new.
5. Test the application and fix errors.
6. Record significant AI prompts, code changes, and verified outcomes.
7. Update this documentation throughout the hackathon.
8. Complete the final summary based on the actual working product.

## Development Documentation Rules

- Keep this document updated throughout development.
- Record actual prompts rather than invented examples.
- Distinguish planned, implemented, and tested features.
- Do not invent errors, fixes, tool usage, or test results.
- Never include passwords, API keys, tokens, or other secrets.
- Verify repository changes and application behavior before claiming success.
