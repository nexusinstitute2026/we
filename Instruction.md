# Nexus Institute LMS — Project Requirements & Implementation Plan

> **ව්‍යාපෘති සාරාංශය**: Nexus Web (marketing site) → Nexus LMS (full Learning Management System).  
> **Build Location**: `d:\Users\Nexus Institute\Documents\Nexus LMS\`  
> **Tech Stack**: Vite + HTML/CSS/JS (Vanilla) + Supabase + Google Drive API + Google Sheets API

---

## 1. Business Requirements (ව්‍යාපාරික අවශ්‍යතා)

### 1.1. පරිශීලක භූමිකාවන් (User Roles)

පද්ධතියේ ප්‍රධාන පරිශීලක භූමිකාවන් 3ක් ඇත.

**Student (සිසුවා)**: පන්ති සඳහා ලියාපදිංචි වීම, ගෙවීම් කිරීම, පන්තිවලට සහභාගී වීම, සහ ප්‍රශ්න පත්‍ර (Quizzes) සඳහා පිළිතුරු සැපයීම.

**Teacher (ගුරුවරයා)**: තම විෂයට අදාළ සිසුන්ගේ ගෙවීම් තත්ත්වය බැලීම, Zoom/YouTube ලින්ක් යාවත්කාලීන කිරීම, Quizzes සහ Assignments සැකසීම.

**Admin (පරිපාලක)**: සියලුම සිසුන්, ගුරුවරුන්, සහ පාඨමාලා කළමනාකරණය කිරීම, ගෙවීම් අනුමත කිරීම (Payment Approvals), සහ පද්ධතියේ ගෝලීය සැකසුම් වෙනස් කිරීම.

---

### 1.2. සිසුන් ලියාපදිංචි වීමේ ක්‍රියාවලිය (Registration & Login)

**Registration** — සිසුවෙකු ලියාපදිංචි වීමේදී පහත විස්තර ලබා දිය යුතුය:
- සම්පූර්ණ නම, පාසල, ලිපිනය, ජාතික හැඳුනුම්පත් අංකය (ID Number), සහ WhatsApp අංකය.

**Login Credentials**:
- Username: සිසුවාගේ WhatsApp අංකය.
- Password: ජාතික හැඳුනුම්පත් අංකයේ පළමු ඉලක්කම් 4.

**Remember Me**: එක් වරක් ලොග් වූ පසු බ්‍රව්සරය මගින් එය මතක තබා ගත යුතු අතර නැවත ලොග් වීමට අවශ්‍ය නොවේ.

---

### 1.3. ගෙවීම් සහ ප්‍රවේශ ක්‍රියාවලිය (Payments & Access Flow)

**Course Selection**: ප්‍රධාන පිටුවෙන් සිසුවාට තමන්ට අවශ්‍ය පාඨමාලා තෝරාගත හැක (Self-Enrollment).

**Payment Slip Upload**:
- සිසුවෙකු පාඨමාලා කිහිපයක් තෝරාගෙන ඇත්නම්, ඒ සියල්ලටම අදාළව එක් ගෙවීම් රිසිට් පතක් (Slip) පමණක් උඩුගත කළ හැක.
- මුදල් ගෙවන්නේ කිනම් පාඨමාලා සඳහාද යන්න තේරීමට Option එකක් ලබා දිය යුතුය.
- Slip එක උඩුගත කරන අවස්ථාවේදී සිසුවාගේ ලිපිනය වෙනස් කිරීමට අවශ්‍ය නම් ඊට ඉඩ ලබා දිය යුතුය.

**Temporary Access**: Slip එක උඩුගත කළ විගසම, තෝරාගත් පාඨමාලා සඳහා **දින 3ක** තාවකාලික ප්‍රවේශයක් (Temporary Access) ස්වයංක්‍රීයව ලැබේ.

**Admin Approval**: Admin විසින් slip එක පරීක්ෂා කර "Approve" කළ පසු, සිසුවාට **ඊළඟ මාසයේ 14 වෙනිදා** දක්වා සම්පූර්ණ ප්‍රවේශය (Active Access) ලැබේ.

**Access Cut-off**: සෑම මාසයකම 14 වන දිනට පෙර ගෙවීම් නොකළ සිසුන්ගේ ප්‍රවේශය ස්වයංක්‍රීයව අක්‍රිය වේ (Remove Access).

---

### 1.4. පන්ති සහ පැමිණීම් ලකුණු කිරීම (Classes & Attendance)

**Zoom Links**: සජීවී පන්ති සඳහා Zoom ලින්ක් එක මත ක්ලික් කළ විගස සිසුවාගේ පැමිණීම (Attendance) ස්වයංක්‍රීයව සටහන් විය යුතුය. ලින්ක් එක හරහා කෙලින්ම Zoom App එක විවෘත විය යුතුය.

**YouTube Links (Recordings)**: පටිගත කළ වීඩියෝ නැරඹීම සඳහා YouTube ලින්ක් එක ක්ලික් කළ විගස "නැරඹුවා" ලෙස දත්ත ගබඩාවේ සටහන් විය යුතුය.

**Google Sheets Sync**: Admin විසින් පාඨමාලාවට අදාළ Zoom සහ YouTube ලින්ක් අඩංගු Google Sheet ලින්ක් එක පද්ධතියට ලබා දුන් විට, එය ස්වයංක්‍රීයව පද්ධතියේ UI එකට යාවත්කාලීන විය යුතුය.

---

### 1.5. ප්‍රශ්න පත්‍ර සහ ශ්‍රේණිගත කිරීම් (Quizzes & Ranking)

- Teacher විසින් සාදන Quizzes සඳහා කාල සීමාවක් (Time Limit) ලබා දිය හැක.
- **Auto-Grading**: සිසුවා Quiz එක Submit කළ විගස ස්වයංක්‍රීයව ලකුණු ප්‍රමාණය ගණනය වී සිසුවාට දිස්විය යුතුය.
- **Automated Ranking**: ලබාගත් ලකුණු ප්‍රමාණය සහ Quiz එක අවසන් කිරීමට ගත වූ කාලය (Time Taken) මත පදනම්ව ස්වයංක්‍රීයව සිසුන්ගේ Rank එක හැදිය යුතුය. (ලකුණු සමාන නම්, අඩුම කාලයකින් නිම කළ සිසුවාට ඉහළ Rank එක හිමිවේ).
- Teacher ට සහ Admin ට මෙම ප්‍රතිඵල Report එකක් ලෙස බැලිය හැක.

---

### 1.6. දැනුම්දීම් (Notifications)

ගෙවීම් අනුමත වූ පසු හෝ අලුත් පාඨමාලාවක් එක් කළ පසු පද්ධතිය ඇතුළත (In-app) Notification එකක් දිස්විය යුතුය. (දැනට WhatsApp Notifications අවශ්‍ය නොවේ).

---

## 2. Technical Requirements (තාක්ෂණික අවශ්‍යතා)

### 2.1. තාක්ෂණික එකතුව (Tech Stack)

| Layer | Technology |
|---|---|
| Frontend | Vite + HTML/CSS (Vanilla) + JavaScript |
| Styling | Vanilla CSS — same design language as Nexus Web |
| Backend & Auth | Supabase (PostgreSQL + Auth + Edge Functions) |
| File Storage | Google Drive API (via Supabase Edge Function) |
| Link Sync | Google Sheets API (via Supabase Edge Function) |

---

### 2.2. දත්ත ගබඩා ව්‍යුහය (Database Schema — Supabase PostgreSQL)

#### 1. `profiles` Table (පරිශීලක දත්ත)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key → auth.users.id |
| role | TEXT | 'student' \| 'teacher' \| 'admin' |
| full_name | TEXT | |
| school | TEXT | |
| address | TEXT | |
| whatsapp_number | TEXT | UNIQUE |
| id_number | TEXT | UNIQUE |
| created_at | TIMESTAMPTZ | |

#### 2. `courses` Table (පාඨමාලා දත්ත)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| title | TEXT | |
| description | TEXT | |
| teacher_id | UUID | FK → profiles.id |
| monthly_fee | DECIMAL | |
| google_sheet_link | TEXT | |

#### 3. `enrollments` Table (සිසුන්ගේ පාඨමාලා ප්‍රවේශය)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| student_id | UUID | FK → profiles.id |
| course_id | UUID | FK → courses.id |
| status | TEXT | 'pending' \| 'temp' \| 'active' \| 'expired' |
| expiry_date | TIMESTAMPTZ | temp=+3days, active=next 14th |

#### 4. `payments` Table (ගෙවීම් දත්ත)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| student_id | UUID | FK → profiles.id |
| amount | DECIMAL | |
| selected_courses | UUID[] | Array of Course IDs |
| slip_drive_link | TEXT | Google Drive URL |
| status | TEXT | 'pending' \| 'approved' \| 'rejected' |
| address_at_payment | TEXT | |

#### 5. `attendance` Table (පැමිණීම් දත්ත)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| student_id | UUID | FK → profiles.id |
| course_id | UUID | FK → courses.id |
| session_type | TEXT | 'zoom' \| 'youtube' |
| session_link | TEXT | |
| clicked_at | TIMESTAMPTZ | |

#### 6. `quizzes` Table (ප්‍රශ්න පත්‍ර)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| course_id | UUID | FK → courses.id |
| title | TEXT | |
| time_limit | INTEGER | Seconds; NULL = unlimited |
| questions | JSONB | Array of question objects |
| created_by | UUID | FK → profiles.id |

#### 7. `quiz_attempts` Table (ප්‍රශ්න පත්‍ර උත්සාහ)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| quiz_id | UUID | FK → quizzes.id |
| student_id | UUID | FK → profiles.id |
| score | INTEGER | |
| time_taken | INTEGER | Seconds |
| answers | JSONB | Student's selected answers |
| rank | INTEGER | Auto-updated by trigger |
| submitted_at | TIMESTAMPTZ | |

#### 8. `notifications` Table (දැනුම්දීම්)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| user_id | UUID | FK → profiles.id |
| message | TEXT | |
| is_read | BOOLEAN | Default: false |
| created_at | TIMESTAMPTZ | |

---

### 2.3. පද්ධති ආරක්ෂාව සහ පාලනය (Security & RLS)

**Row Level Security (RLS) in Supabase**:
- සිසුන්ට පෙනෙන්නේ ඔවුන්ගේ දත්ත සහ ඔවුන් ලියාපදිංචි වී ඇති පාඨමාලා පමණි.
- ගුරුවරුන්ට පෙනෙන්නේ තමන්ට අදාළ පාඨමාලා සහ තම පාඨමාලාවට මුදල් ගෙවා ඇති සිසුන් පමණි.
- පරිපාලකයන්ට (Admins) සියලුම දත්ත සඳහා කියවීමේ/වෙනස් කිරීමේ (Read/Write) ප්‍රවේශය ඇත.

---

### 2.4. Integrations (බාහිර සම්බන්ධතා)

**Google Drive API** (Supabase Edge Function හරහා):
- Frontend එකෙන් ලබාදෙන රූපය (Slip) Supabase Edge Function එකක් හරහා Google Drive හි අදාළ Folder එකට Upload වී, එහි Shareable Link එක payments වගුවේ සටහන් වේ.

**Google Sheets API**:
- Admin විසින් Sheet link එක ලබා දුන් විට, එය කියවා Zoom/YouTube ලින්ක් සහ අදාළ දින වකවානු UI එකෙහි ප්‍රදර්ශනය කිරීම.

---

### 2.5. තීරණාත්මක තර්කනයන් (Critical Logic Points)

**Password Generation**: profiles table එකට දත්ත ඇතුළත් කිරීමේදී id_number හි මුල් අක්ෂර 4 වෙන් කර, එය Supabase Auth හි password එක ලෙස encrypt කර ගබඩා කළ යුතුය.

**Ranking Algorithm**: quiz_attempts වගුව වෙත දත්ත යැවූ පසු, Database Trigger එකක් හෝ Edge Function එකක් මගින් අදාළ Quiz එකෙහි සියලු සිසුන්ගේ ලකුණු (Descending) සහ ගත වූ කාලය (Ascending) අනුව Rank එක ස්වයංක්‍රීයව යාවත්කාලීන (Update) කළ යුතුය.

---

## 3. Project Structure (ගොනු ව්‍යුහය)

```
Nexus LMS/
├── Instruction.md              ← මෙම ලේඛනය
├── package.json
├── vite.config.js
├── index.html                  ← Login page (public entry point)
├── register.html               ← Student registration
├── dashboard/
│   ├── student.html            ← Student dashboard
│   ├── teacher.html            ← Teacher dashboard
│   └── admin.html              ← Admin dashboard
├── pages/
│   ├── course.html             ← Course detail (sessions, attendance)
│   ├── quiz.html               ← Take a quiz
│   ├── quiz-results.html       ← Quiz result + ranking
│   └── payment.html            ← Payment slip upload
├── admin/
│   ├── users.html              ← Manage users
│   ├── courses.html            ← Manage courses
│   └── payments.html          ← Approve/reject payments
├── teacher/
│   ├── quiz-builder.html       ← Create/edit quizzes
│   └── reports.html            ← Quiz reports
├── js/
│   ├── supabase.js             ← Supabase client init
│   ├── auth.js                 ← Auth helpers
│   ├── student.js
│   ├── teacher.js
│   ├── admin.js
│   ├── quiz.js
│   ├── payment.js
│   └── notifications.js
├── css/
│   ├── base.css                ← Design tokens (Nexus Web style)
│   ├── auth.css
│   ├── dashboard.css
│   ├── course.css
│   └── quiz.css
├── images/                     ← Copied from Nexus Web
├── fonts/                      ← Copied from Nexus Web
└── supabase/
    ├── schema.sql              ← Full DB schema + RLS policies
    ├── triggers.sql            ← Ranking trigger + expiry cron
    └── functions/
        ├── upload-slip/        ← Edge Function: Google Drive upload
        └── sync-sheet/         ← Edge Function: Google Sheets reader
```

---

## 4. Implementation Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Project Scaffold + Design System | ⬜ Not Started |
| 2 | Authentication (Login + Registration) | ⬜ Not Started |
| 3 | Student Dashboard + Course + Payment | ⬜ Not Started |
| 4 | Quizzes + Auto-Ranking | ⬜ Not Started |
| 5 | Teacher Dashboard + Quiz Builder | ⬜ Not Started |
| 6 | Admin Dashboard + Payment Approvals | ⬜ Not Started |
| 7 | DB Schema + RLS + Triggers + Edge Functions | ⬜ Not Started |
| 8 | Notifications System | ⬜ Not Started |
| 9 | Testing + Polish + Deployment | ⬜ Not Started |

---

## 5. Open Questions (Before Starting)

1. **Supabase Project**: Do you have a Supabase project already? If yes, provide the Project URL and `anon` API key.
2. **Google Cloud**: Is there a Google Cloud project with Drive API + Sheets API enabled? (Need Service Account JSON key)
3. **Hosting**: Where to deploy? Vercel / Netlify / GitHub Pages?
4. **Language**: LMS UI fully in Sinhala, or bilingual (Sinhala + English)?
5. **First Admin**: Should I create a seeder/script to set up the first Admin account?