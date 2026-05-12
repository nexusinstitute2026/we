# Nexus LMS — Professional Learning Management System

## 1. Professional LMS Core Features (2024-2025 Standards)

### **Administrator Role (Governance & Oversight)**
- **Role-Based Access Control (RBAC):** Fine-tuned permissions for different admin levels.
- **Bulk User Management:** Ability to import students/teachers via CSV/Excel.
- **Comprehensive Analytics:** Institutional-level reports on enrollment trends and revenue.
- **Audit Logs:** Tracking critical system changes for security.
- **System Branding:** Customization of themes, logos, and communication templates.

### **Teacher Role (Instruction & Engagement)**
- **Drag-and-Drop Course Builder:** Intuitive interface to organize lessons and modules.
- **Advanced Assessment Engine:** Question banks, randomized quizzes, and varied question types (MCQ, True/False, Short Answer).
- **Automated & Manual Grading:** Speed-grading interface for essay-type assignments.
- **Engagement Analytics:** Identify "at-risk" students who haven't logged in or are failing.
- **Communication Hub:** Announcement system and direct student messaging.

### **Student Role (Learning Experience)**
- **Personalized Learning Paths:** Visual progress tracking and module locking (drip content).
- **Mobile-Responsive Design:** Seamless learning on smartphones (Essential for modern students).
- **Resource Repository:** Quick access to PDFs, recordings, and class materials.
- **Social Learning:** Peer leaderboards, discussion forums, and comment sections.
- **Certification:** Automated certificate generation upon course completion.

---

## 2. Implementation Plan for Nexus LMS

### **Phase 1: Database & Core Security ✅ DONE**
- [x] Advanced Schema with Section > Category > Subject > Course hierarchy
- [x] Role-based authentication (Admin/Teacher/Student)
- [x] RLS (Row Level Security) for data privacy
- [x] Seed data script for initial setup

### **Phase 2: Admin Console ✅ DONE**
- [x] **Dashboard:** Stats overview (students, courses, payments, enrollments)
- [x] **Hierarchy Editor:** Full CRUD for Sections, Categories, Subjects, Courses
- [x] **Payment Approval:** Card-based layout with slip preview, filter tabs
- [x] **User Management:** Edit/delete users, change roles, search, card-based UI
- [x] **Enrollment Management:** View, activate, expire, delete enrollments with filters
- [x] **Notification System:** Real-time push notifications panel

### **Phase 3: Teacher Tools ✅ DONE**
- [x] Teacher dashboard with assigned subjects & courses
- [x] Google Sheet sync for session schedules (Zoom/YouTube links)
- [x] Quiz creation (basic)
- [x] Assignment management (basic)

### **Phase 4: Student Experience ✅ DONE**
- [x] Student dashboard with enrolled sections & catalog
- [x] Section detail page (Category > Subject > Course navigation)
- [x] Course page with Sessions, Assignments, Quizzes tabs
- [x] Daily class reminder modal
- [x] Payment slip upload & temp enrollment
- [x] Notification system

### **Phase 5: Advanced Features (Future)**
- [ ] **Push Notifications:** Web-push or WhatsApp alerts for class start
- [ ] **Mobile App:** Potential React Native wrapper for better access
- [ ] **Gamification:** Points system for attending live classes
- [ ] **Bulk User Import:** CSV upload for mass student registration
- [ ] **Advanced Quiz Builder:** Question bank, timer, randomization
- [ ] **Certificate Generation:** Auto-certificates on course completion
- [ ] **Discussion Forums:** Per-course discussion boards
- [ ] **Progress Tracking:** Visual progress bars per course

---

## 3. Tech Stack
- **Frontend:** Vanilla JS + HTML + CSS (Vite dev server)
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Sheet Sync:** Google Visualization API (gviz/tq) — client-side
- **Fonts:** Noto Serif Sinhala + Outfit (Google Fonts)

## 4. Login Credentials
- **Admin:** `0770000000` / `admin123`
- **Teacher:** `madhubhashini@nexus.lms` / `teacher`
- **Student:** Register via `/register.html` (WhatsApp + ID number)

## 5. Project Structure
```
Nexus LMS/
├── admin/           # Admin management pages
│   ├── courses.html     # Full hierarchy CRUD
│   ├── payments.html    # Payment approval workflow
│   ├── users.html       # User management
│   └── enrollments.html # Enrollment management
├── dashboard/       # Role-specific dashboards
│   ├── admin.html
│   ├── teacher.html
│   └── student.html
├── pages/           # Shared pages
│   ├── course.html      # Course detail (sessions/quizzes/assignments)
│   ├── section.html     # Section detail for students
│   ├── payment.html     # Payment slip upload
│   ├── quiz.html        # Quiz taking
│   └── quiz-results.html
├── js/              # JavaScript modules
│   ├── admin.js         # Admin CRUD operations
│   ├── auth.js          # Authentication helpers
│   ├── payment.js       # Payment & enrollment logic
│   ├── quiz.js          # Quiz engine
│   ├── notifications.js # Notification system
│   ├── ui.js            # UI utilities (toast, modals, sidebar)
│   └── supabase.js      # Supabase client config
├── css/             # Stylesheets
│   ├── base.css         # Design system & tokens
│   ├── dashboard.css    # Dashboard layouts
│   └── course.css       # Course page styles
├── scripts/         # Setup scripts
│   ├── seed-data.js     # Database seeding
│   └── seed-admin.js    # Admin account setup
└── supabase/
    └── schema.sql       # Database schema
```
