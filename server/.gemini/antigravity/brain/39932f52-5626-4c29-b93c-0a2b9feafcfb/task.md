# Implementing Progressive Profiling (Option 2)

## Phase 1: Planning
- [x] Analyze current frontend (`Step4SkillsResume.jsx`, `StudentSignup.jsx`) and backend (`Student.js` model).
- [ ] Create implementation plan and task breakdown.

## Phase 2: Frontend Signup Redesign (Skill Collection only)
- [x] Refactor `Step4SkillsResume.jsx` to remove Resume fields entirely.
- [x] Rename the component references in `StudentSignup.jsx`.
- [x] Polish the UI of the Skills section to be premium and modern.

## Phase 3: Dashboard Resume Upload UI
- [x] Create a specialized `ResumeUploadWidget.jsx` with drag-and-drop, upload progress animation, and a premium Glassmorphism aesthetic.
- [x] Integrate the `ResumeUploadWidget` into `StudentDashboard.jsx` if the student has not yet uploaded a resume.
- [x] Bind widget state to API wrapper.

## Phase 4: Backend File Upload Integration
- [x] Install necessary packages (`multer`, `cloudinary`, `multer-storage-cloudinary`) on the backend.
- [x] Create a Cloudinary config and multer upload middleware.
- [x] Create a `POST /api/student/resume-upload` endpoint that handles the file, updates the `Student` document's `resumeUrl`, and returns the updated completion percentage.
- [x] Ensure the file endpoints are secured.

## Phase 5: Verification & Polish
- [ ] Test the entire signup flow (ensuring no resume requirement blocking).
- [ ] Test the dashboard resume upload and progress bar updates.
