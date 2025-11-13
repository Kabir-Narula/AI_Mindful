# Project Plan: MindfulAI — AI-Powered Mental Health & Mood Journal

**Project Team:** [Your Name(s)]
**Course:** Artificial Intelligence (Modules used: 2, 3, 4, 5)
**Prepared:** November 3, 2025

---

## Overview
MindfulAI is an intelligent mood journaling web application that helps users capture daily feelings, surface emotional patterns, and receive supportive, rule-based suggestions. The project intentionally uses course material from Module 2 (Agents), Module 3 (Searching algorithms), Module 4 (Game Theory), and Module 5 (Logical Agents). It avoids advanced deep-learning approaches beyond the course scope, relying instead on classical NLP toolkits (NLTK, spaCy, TextBlob) and symbolic/algorithmic AI techniques.

Primary goals:
- Implement an agent that perceives, reasons, and acts to support journaling.
- Use search algorithms to discover temporal triggers and correlations in mood data.
- Apply game-theoretic design to balance engagement and intrusiveness.
- Use logical agents (rule-based systems) for alerts and intervention suggestions.

Success criteria:
- Working end-to-end web app with user auth, journaling, sentiment extraction, agent follow-ups, pattern detection, and analytics.
- Milestone demo ready by Nov 14 showing core features.
- Poster and presentation materials ready by Nov 24.
- Final report and repository delivered by Dec 12.

---

## High-level Architecture
- Frontend: React + Vite — auth UI, journaling UI, agent chat UI, analytics dashboard.
- Backend: FastAPI (Python) — REST API, agent logic, search engine, rule engine.
- Database: PostgreSQL (or SQLite for local/demo) — stores user profiles, entries, derived features.
- NLP: NLTK / spaCy / TextBlob — tokenization, sentiment scoring, keyword extraction.
- Algorithms: A*/heuristic search for pattern discovery, utility functions and simple payoff models for engagement decisions, propositional/first-order rule engine for interventions.

---

## Deliverables (by milestone)
- Executive Summary (submitted) — completed.
- Project Plan (this file) — completed.
- Project Milestone Demo (Nov 14): Basic journaling, sentiment scoring, agent follow-up, simple analytics.
- Poster (week of Nov 24): Research poster summarizing problem, solution, design, and early results.
- Presentation (week of Nov 24 / Dec 1): 12-15 minute talk + live demo.
- Final Report (Dec 12): ~10 pages PDF, code pushed to GitHub, reproducible instructions.

---

## Weekly Timeline & Task Breakdown
(Each week lists specific tasks and owners; adjust as team forms.)

Week 1 — Foundation (Nov 3 - Nov 9)
- Day 1: Finalize scope; create repo and folder structure; add `Project_Plan.md` and `Executive_Summary.md` to repo. (Owner: Lead)
- Day 2: Initialize backend skeleton (FastAPI), create `requirements.txt`, set up virtual environment and basic app route. (Owner: Backend)
- Day 3: Initialize frontend skeleton (React + Vite), create routing and global layout. (Owner: Frontend)
- Day 4: Implement DB models (User, JournalEntry, EntryMetadata) using SQLAlchemy. (Owner: Backend)
- Day 5: Implement user registration & JWT login endpoints; connect frontend auth UI. (Owners: Backend + Frontend)
- Day 6: Create Journal CRUD endpoints and simple entry editor UI. (Owners: Full stack)
- Day 7: Integrate basic NLP pipeline (text cleaning, sentiment score via TextBlob) run server-side when entries are saved. (Owner: Backend)

Success target for Week 1: Users can register, log in, create a journal entry; each entry saved with a basic sentiment score.

Week 2 — Core AI Modules (Nov 10 - Nov 16)
- Day 8: Module 2 — Implement the Intelligent Agent prototype: perception (read sentiment & keywords), reasoning (rules to pick follow-ups), action (return follow-up prompts). Use rule templates (if-negative -> ask follow-up). (Owner: Backend)
- Day 9: Module 3 — Implement pattern discovery features: define feature vector per entry (date, sentiment, keywords, length), prototype time-windowed search using heuristic search (A*/best-first) to find sequences that correlate with low mood. (Owner: Backend/Data)
- Day 10: Module 4 — Define utility model for question selection: construct simple payoff functions for engagement vs intrusiveness. Implement a strategy chooser that uses payoff to choose whether to ask a follow-up or defer. (Owner: Backend)
- Day 11: Module 5 — Implement rule-based logical agent: express rules like "IF mood<=-0.5 AND consecutive_days>=3 THEN flag_for_suggestion('seek_support')". Create a small rule set mapped to action suggestions. (Owner: Backend)
- Day 12: Integrate agent endpoints into chat UI; frontend can request follow-ups after submitting an entry. (Owners: Full stack)
- Day 13: Build an analytics endpoint that aggregates per-user stats (moving average of sentiment, heatmap data). (Owner: Backend)
- Day 14: Prepare Milestone Demo materials and script; test all flows end-to-end. (Owners: All)

Success target for Week 2: Agent can provide rule-based follow-ups, pattern discovery identifies at least one trigger pattern in test data, and the engagement strategy is functional.

Week 3 — Features & Polish (Nov 17 - Nov 23)
- Add UX polish to dashboard and analytics (charts via Chart.js or Recharts).
- Implement search/history page to lookup past entries (text search + metadata filters).
- Add export-to-PDF for selected range of entries (for therapist share).
- Implement basic client-side voice record and store audio blob (server-side transcription optional as stretch goal).
- Write unit tests for backend agent logic and search algorithm.
- Security review: ensure JWT expiry, password hashing (bcrypt), input validation.

Week 4 — Poster & Presentation (Nov 24 - Nov 30)
- Prepare poster assets showing architecture, example screenshots, sample results from demo users/test dataset.
- Finalize presentation slides and demo script.
- Run practice presentation and time it; refine based on feedback.

Weeks 5-6 — Final Report & Wrap-up (Dec 1 - Dec 12)
- Finalize report narrative; include methods, design decisions, limitations, future work.
- Polish README, add deployment notes and simple `docker-compose` for demo environment (optional).
- Run final tests and ensure reproducibility; tag release and push to GitHub.

---

## Roles & Responsibilities (suggested for group of up to 3)
- Lead / Project Manager: scope, timelines, demo coordination, report writing.
- Backend / AI Engineer: FastAPI backend, agent logic, search algorithms, rule engine.
- Frontend / UX Engineer: React app, visualizations, accessibility, demo UI.

(If working solo, allocate blocks of time to each area in the weekly plan.)

---

## Technical Approach (detailed per module)

Module 2 — Intelligent Agents
- Implement perceiver: pipeline extracts sentiment (numeric), top keywords, and meta-features (sleep mention, exercise, etc.).
- Implement a rule-based reasoner with prioritized rules that select from a library of empathetic follow-ups (e.g., "I’m sorry that happened — can you tell me what you were thinking at that moment?").
- Actions are either immediate follow-up prompts or suggestions stored for the dashboard.

Module 3 — Search Algorithms (Pattern Discovery)
- Represent each entry as a node: (date, sentiment, features).
- Use time-window graphs and best-first/A* search with heuristics (e.g., drop in sentiment magnitude, keyword recurrence) to find shortest/highest-scoring paths leading to negative mood states.
- Output candidate triggers (keywords, events, weekday patterns) with confidence scores.

Module 4 — Game Theory (Engagement)
- Define user-state utility functions: U_engage = benefit_of_followup - cost_of_intrusion.
- Model follow-up selection as a one-shot decision using estimated probabilities of engagement (learned heuristically from past behavior) and pick action maximizing expected utility.
- Keep models simple (closed-form heuristics) to remain within course scope.

Module 5 — Logical Agents (Rule Engine)
- Use a small rule language (JSON or Python DSL) to define intervention rules mapping observed facts to actions.
- Rules example: IF (sentiment < -0.6 AND mentions('sleep') AND consecutive_low_days >= 3) => SUGGEST('sleep_hygiene_tip') and FLAG('consider_professional_help').

---

## Data & Privacy
- Data collected: journal text, timestamps, optional audio, derived sentiment/keywords.
- Privacy model: data encrypted (at rest) in DB, transport over HTTPS, users can delete their data at any time.
- Ethical safeguards: clear disclaimers, immediate signposting to crisis resources if rule engine detects severe risk language, and opt-in options for cloud backup.

---

## Risks & Mitigation
- Risk: Overreach (app perceived as therapy). Mitigation: prominent disclaimers and signposting to professionals; limit clinical claims.
- Risk: False positives/negatives in emotion detection. Mitigation: conservative thresholds and explainable rules; store raw scores and let user confirm insights.
- Risk: Time constraints. Mitigation: build minimal viable features first (MVP) and add enhancements after milestone.

---

## Acceptance Criteria (for instructor sign-off)
- Authentication works and users can create and retrieve journal entries.
- Each saved entry has a derived sentiment score and keywords.
- Agent endpoint returns context-aware follow-up prompts for negative or ambivalent entries.
- Search algorithm identifies at least one plausible trigger in a test dataset and exposes it via API.
- Logical rules can flag entries for suggested interventions and the UI surfaces these suggestions.
- Milestone demo shows the flow from journal entry to agent follow-up to analytics output.

---

## Next Steps (immediate)
1. Confirm approval to proceed with scope as written.
2. If approved, set up repo and allocate tasks (see todo list in project board).  
3. I will begin Day 1 implementation: repository initialization and skeletons.

---

**Saved file path:** `c:\Users\kabir\Desktop\Ai_ assi\Project_Plan.md`

Please review and tell me if you'd like changes to task granularity, dates, or role assignments — I can update the plan and the todo list accordingly.