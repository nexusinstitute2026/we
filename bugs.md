# Nexus LMS Bug & Fix Report

This report documents the bugs found and fixed in the Nexus LMS system on 2026-05-06.

## 1. Notification System Issues
- **Bug**: `handleNotifClick` was called via inline `onclick` but never defined globally, causing a ReferenceError when clicking a notification.
- **Fix**: Removed inline `onclick`. Implemented a robust delegated event listener within `renderNotifications` in `js/notifications.js` to handle marking notifications as read and updating badges.
- **Bug**: Student dashboard was not subscribing to real-time notifications.
- **Fix**: Added `subscribeNotifications` call to `dashboard/student.html`.
- **Bug**: `subscribeNotifications` used a generic channel name ('notifications'), causing potential cross-talk or security risks.
- **Fix**: Updated channel name to be user-specific: `notifications:${userId}`.

## 2. Database Column Mismatches (Schema Consistency)
- **Bug**: Multiple files queried or updated the `enrollments` table using a `status` or `expiry_date` column, but these columns do not exist in the `schema.sql`.
  - Affected files: `dashboard/teacher.html`, `js/admin.js` (`getAdminStats`, `updateEnrollment`).
- **Fix**: Removed non-existent column filters and update logic to prevent SQL errors. 
- **Note**: If `status` (active/expired) is required for enrollments, the schema must be updated via `ALTER TABLE enrollments ADD COLUMN status TEXT...`.

## 3. UI & Profile Population
- **Bug**: `teacher/reports.html` was missing `id` attributes for the user profile chip, preventing the `populateUserChip` function from displaying the teacher's name.
- **Fix**: Added `id="user-avatar"`, `id="user-name"`, and `id="user-role"` to the HTML.
- **Bug**: Icon inconsistency in `teacher/assignments.html` sidebar.
- **Fix**: Corrected the SVG icon for the "Quiz Reports" link to match the rest of the dashboard.

## 4. Quiz Builder Stability
- **Bug**: Creating a quiz would fail during student notification because the logic attempted to filter `enrollments` by a non-existent `status` column.
- **Fix**: Fixed in `js/quiz.js` and `teacher/quiz-builder.html` to ensure successful publication.

---
**Status**: All identified critical bugs have been fixed and verified in the source code.
