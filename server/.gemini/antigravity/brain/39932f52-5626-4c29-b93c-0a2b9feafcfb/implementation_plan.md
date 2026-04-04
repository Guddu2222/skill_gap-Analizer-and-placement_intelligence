# Option 2 Implementation: Progressive Resume Profiling

This plan details how we will transition from an all-at-once data collection approach during student signup to a smoother "Progressive Profiling" model, where skills are collected initially, and the heavy resume file upload is deferred to the Student Dashboard.

## Proposed Changes

---

### Backend Components

#### [NEW] Backend File Storage Dependencies
We will install `multer`, `cloudinary`, and `multer-storage-cloudinary` to the `server/package.json` to handle real PDF/Doc file uploads directly to a cloud provider rather than relying on users pasting generic Google Drive links.

#### [NEW] `server/config/cloudinary.js`
Create configuration for connecting to Cloudinary using standard environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

#### [NEW/MODIFY] `server/routes/student.js` (or relevant profile route)
Implement a `POST /api/student/upload-resume` endpoint:
1. Passes through Multer middleware to buffer file and upload to Cloudinary.
2. Updates the `Student` document with the resulting `resumeUrl`.
3. Triggers the internal `profileCompletionPercentage` recalculation.
4. Returns the updated profile.

---

### Frontend Components

#### [MODIFY] `client/src/pages/signup/signup-steps/Step4SkillsResume.jsx`
- **Rename/Refactor**: The UI will drop the "Resume Link" input section entirely.
- Improve the visual design of the Skills section (premium inputs, pill-tags with animations).
- Streamline the form payload so it cleanly passes just Skills and Social Links to the next step.

#### [MODIFY] `client/src/pages/signup/StudentSignup.jsx`
- Ensure any strict validations on `resumeUrl` are bypassed during the initial registration payload.

#### [NEW] `client/src/components/student/ResumeUploadWidget.jsx`
A completely custom, premium UI component designed to sit on the Dashboard:
- **State 1:** "Missing Resume" call to action with a dashed-border dropzone, Cloud upload icon, and smooth micro-animations on hover.
- **State 2:** "Uploading" with a progress bar and sleek file-processing animation.
- **State 3:** "Uploaded / Success" state displaying the file name, with an option to replace/update the resume.

#### [MODIFY] `client/src/pages/StudentDashboard.jsx`
- Inject the `ResumeUploadWidget` conspicuously beneath the dynamic header section **if** `student.resumeUrl` is missing or empty.
- When successfully uploaded, dynamically update the visible `profileCompletionPercentage` in the header without requiring a page reload.

## Verification Plan

### Automated/Manual Verification
1. I will walk through the `StudentSignup` sequence to ensure it no longer asks for or requires a resume before successfully reaching Step 7 (Email Verification).
2. I will log in to the dashboard to test rendering of the `StudentDashboard.jsx` and the new `ResumeUploadWidget`.
3. Using a mock PDF file, I'll execute the Drag & Drop upload and confirm the Cloudinary endpoint processes it and the Dashboard updates state seamlessly.
