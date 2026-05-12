# Nexus LMS System Catalog

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Core Features](#core-features)
4. [Directory & File Structure](#directory--file-structure)
5. [Frontend Components](#frontend-components)
6. [Backend / Supabase Integration](#backend--supabase-integration)
7. [Database Schema Highlights](#database-schema-highlights)
8. [API Endpoints & Data Flow](#api-endpoints--data-flow)
9. [Authentication & Authorization](#authentication--authorization)
10. [Notifications & Reminders](#notifications--reminders)
11. [Deployment & Build Process](#deployment--build-process)
12. [Future Enhancements](#future-enhancements)
---

## Project Overview
The **Nexus Learning Management System (LMS)** is a web‑based platform that supports three primary user roles:
- **Students** – view courses, track progress, view leaderboards, and receive notifications.
- **Teachers** – create and manage courses, assignments, quizzes, grade student work, and generate reports.
- **Admins** – manage users, payments, enrollments, and overall system configuration.

The system is built with vanilla HTML, CSS, and JavaScript on the front‑end, while leveraging **Supabase** as a backend‑as‑a‑service for authentication, database storage, and edge functions. The project uses **Vite** for development tooling and a small Node.js utility script for asset generation.

---

## Architecture Overview
```
+---------------------------------------------------+
|                     Browser                       |
|  (HTML, CSS, JS – served by Vite dev server)     |
+----------------------+----------------------------+
                       | HTTP requests (REST/JS)
+----------------------+----------------------------+
|                 Supabase Backend                 |
|  • PostgreSQL database                           |
|  • Auth (JWT, magic links)                      |
|  • Edge Functions (optional)                     |
+----------------------+----------------------------+
                       | git repo (source code)
+----------------------+----------------------------+
|                Local Workspace                    |
|  • d:\Users\Nexus Institute\Documents\Nexus LMS |
+---------------------------------------------------+
```

---

## Core Features
| Area | Feature | Description |
|------|---------|-------------|
| **Student** | Dashboard | Overview of enrolled courses, progress bars, upcoming classes. |
| | Leaderboard | Global ranking based on quiz scores and activity points. |
| | Notifications | Push/Browser notifications for new assignments, deadlines. |
| **Teacher** | Course Management | Create, edit, archive courses; upload resources. |
| | Assignment Builder | Design assignments, set due dates, attach rubrics. |
| | Quiz Builder | Create timed quizzes with multiple‑choice, true/false, etc. |
| | Grading Interface | Manual grading per student with feedback comments. |
| | Reports | Generate CSV/HTML reports on student performance. |
| **Admin** | User Management | CRUD for students, teachers, admin accounts. |
| | Payments & Enrollments | View and manage payment records, enrollment status. |
| | System Settings | Configure global parameters (e.g., leaderboard weighting). |

---

## Directory & File Structure
```
+--- .
|   .env, .gitignore, package.json, readme.md, vite.config.js
+--- css
|   auth.css, base.css, course.css, dashboard.css
+--- admin
|   courses.html, enrollments.html, payments.html, users.html
+--- teacher
|   activity.html, assignments.html, progress.html, quiz-builder.html, reports.html
+--- dashboard
|   student.html
+--- pages
|   leaderboard.html, month.html, login.html, register.html, ...
+--- js
|   leaderboard.js, other component scripts
+--- supabase
|   leaderboard.sql (SQL schema for leaderboard view)
+--- images, fonts, etc.
```

---

## Frontend Components
- **HTML Templates** – static pages located in `pages/`, `admin/`, `teacher/`, and `dashboard/` directories.
- **CSS Design System** – `css/base.css` provides global resets; `css/dashboard.css` defines dark‑mode glassmorphism UI, gradients, and micro‑animations. The UI follows a premium aesthetic with custom fonts (e.g., Google **Inter**) loaded via `@import`.
- **JavaScript Modules** – `js/leaderboard.js` handles fetching leaderboard data via Supabase client, renders charts with Chart.js, and adds hover animations.
- **Dynamic Forms** – assignment and quiz builders utilise vanilla JS for client‑side validation and progressive disclosure.

---

## Backend / Supabase Integration
- **Authentication** – Managed via Supabase Auth; JWT stored in `localStorage`. Login flow implemented in `login.html` script.
- **Database** – PostgreSQL tables include `users`, `courses`, `enrollments`, `assignments`, `submissions`, `leaderboard`. The `supabase/leaderboard.sql` file defines a materialized view used by the leaderboard page.
- **Edge Functions (optional)** – Placeholder for future server‑side logic (e.g., email reminders).

---

## Database Schema Highlights
```
users(id UUID PK, email TEXT, role TEXT, created_at TIMESTAMP)
courses(id UUID PK, title TEXT, description TEXT, teacher_id UUID FK)
enrollments(user_id UUID FK, course_id UUID FK, status TEXT)
assignments(id UUID PK, course_id UUID FK, title TEXT, due_date DATE)
submissions(id UUID PK, assignment_id UUID FK, student_id UUID FK, grade NUMERIC, feedback TEXT)
leaderboard (materialized view aggregating scores)
```

---

## API Endpoints & Data Flow
- **GET /api/courses** – Returns list of courses for the logged‑in user (student or teacher).
- **POST /api/assignments** – Teacher creates a new assignment; validates payload before inserting.
- **GET /api/leaderboard** – Public endpoint that queries the `leaderboard` view.
- **WebSocket (future)** – Real‑time progress updates.

Data flow follows a simple fetch‑then‑render pattern; all requests include the Supabase JWT for authentication.

---

## Authentication & Authorization
- **Roles**: `student`, `teacher`, `admin` stored in `users.role`.
- **Client Guard** – Each HTML page checks the JWT and role; unauthorized users are redirected to `login.html`.
- **Server‑side RLS** – Supabase Row‑Level Security policies enforce that teachers can only modify their own courses, and students can only read their enrollments.

---

## Notifications & Reminders
- **Browser Push** – Implemented via Service Worker (`sw.js`).
- **Email (planned)** – Edge function will send reminder emails for upcoming deadlines.
- **UI Badges** – Dynamic badge counts shown on the dashboard.

---

## Deployment & Build Process
1. **Development** – `npm run dev` starts Vite dev server on `localhost:5173`.
2. **Static Build** – `npm run build` outputs optimized assets to `dist/`.
3. **Deploy** – Host `dist/` on any static web host (Netlify, Vercel) and connect Supabase project URL in `.env`.

---

## Future Enhancements
- **Role‑Based Dashboards** – Separate UI themes per role.
- **Analytics Dashboard** – Admin view of platform usage metrics.
- **Live Chat Support** – Integrated via a third‑party widget.
- **Mobile‑Optimized PWA** – Add offline support and installable app capabilities.

---

*This catalog is intended as a living document; please update it as new modules or features are added.*
