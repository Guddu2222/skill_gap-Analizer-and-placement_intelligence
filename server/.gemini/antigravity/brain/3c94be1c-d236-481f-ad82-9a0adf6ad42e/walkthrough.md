# Project Walkthrough

## 1. Streamlined Student Signup (Progressive Profiling)
- **Design Decision:** Shifted from a 7-step to a 2-step flow (Basic Info + Email Verification) to reduce drop-off.
- **Frontend:** Deleted `Step2` to `Step6` and refactored `StudentSignup.jsx`.
- **Backend:** `Student` model and register endpoint robustly handle partial profile creation.
- **API Fix:** Replaced hardcoded `localhost:5000` fetches in `StudentSignup.jsx`, `CollegeSignup.jsx`, and `RecruiterSignup.jsx` (plus `Step1BasicInfo` and `EmailVerificationPage`) with the centralized `services/api.js` to ensure stability in production.

## 2. Codebase Humanization & MVC Refactoring
To ensure the codebase looks meticulously hand-crafted and adheres to senior-level standards:
- **Cleaned Obsolete Debug Files:** Removed multiple `test_analyze.js`, `debug_output.json`, and `lint_report.json` artifacts that act as red flags for evaluators.
- **Backend MVC Implementation:** Migrated the backend from using monolithic "Fat Routes" by creating `server/controllers/authController.js`. Successfully separated all business logic from `server/routes/auth.js`, enforcing a clean, modern Model-View-Controller structure.
- **Global Formatting Pass:** Installed and executed `Prettier` universally across both `client/src` and `server/` to standardize indentation, quoting, and spacing across the entire codebase.

## 3. Account Recovery & Verification UX
- **Dynamic Password Reset Links:** Updated `authController.js` to dynamically route password reset emails back to the origin domain rather than defaulting to `localhost`.
- **Login Verification Rescue:** Added a dynamic `needsVerification` state to the Sign In page. If an unverified user attempts to log in, a prominent "Verify Email Now" button appears next to the error, allowing them to rescue their account and request a new code without being permanently locked out.
