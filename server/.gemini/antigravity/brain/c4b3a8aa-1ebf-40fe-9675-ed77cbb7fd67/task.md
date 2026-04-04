# Authentication UI & Security Enhancements

## Phase 1-4: Auth Improvements Complete
- [x] Initial UI Revamp, Email Verification structure, and Cookie Sessions completed.

## Phase 5: Gmail Configuration Update
- [x] **Environment**: Update `server/.env` with provided Gmail and Cloudinary credentials.
- [x] **Email Utility**: Update `server/utils/sendEmail.js` to use `service: 'gmail'` instead of custom SMTP host/port to simplify configuration and guarantee delivery.

## Phase 6: Profile Image Upload (Cloudinary)
- [x] **Dependencies**: Install `multer`, `cloudinary`, and `multer-storage-cloudinary` in backend.
- [x] **Config**: Create `server/config/cloudinary.js` to initialize Cloudinary and set up the Multer storage engine.
- [x] **Model**: Add `profileImage` (String) to the `User` schema.
- [x] **Routes & Controllers**: 
   - Update `registerUser` endpoint to handle `multipart/form-data` using Multer.
   - Extract the uploaded Cloudinary URL (`req.file.path`) and save it to the database during signup.
- [x] **Frontend Registration**: 
   - Add a file input to `Register.jsx`.
   - Implement temporary image preview functionality.
   - Refactor the Axios call to transmit `FormData` instead of JSON.
- [x] **Frontend Display**: Update `DashboardLayout` (or a similar protected component) to render the `user.profileImage` or a default fallback avatar.

## Phase 10: Profile Image Update from Dashboard
- [x] **Backend Updates**: Add `PUT /api/auth/profile-image` route and `updateProfileImage` controller methods.
- [x] **Frontend Updates**: Add `updateProfileImage` to `AuthContext.jsx`.
- [x] **UI Interactivity**: Refactor `DashboardLayout.jsx` avatar container with a hidden `<input type="file" />` and hover states.

## Phase 7: OTP 6-Digit Verification
- [x] **Backend Logic**: Update `registerUser` to generate a 6-digit numeric string instead of hex string.
- [x] **New Routes**: Add `POST /api/auth/verify-email` and `POST /api/auth/resend-verification`.
- [x] **Frontend Page**: Integrate the new `EmailVerificationPage.jsx` logic using lucide-react. Send OTP payload correctly.

## Phase 8: Forgot / Reset Password
- [x] **Data Model**: Update `User.js` to include fields for `resetPasswordToken` and `resetPasswordExpire`.
- [x] **Backend Routes**: Add `POST /api/auth/forgot-password` and `PUT /api/auth/reset-password/:token` in `authRoutes.js`.
- [x] **Backend Controllers**: 
   - Write `forgotPassword` to generate a crypto reset token and email a link to the user.
   - Write `resetPassword` to accept the new password, verify the token, and securely hash the update.
- [x] **Frontend Pages**: Create `client/src/pages/ForgotPassword.jsx` (from user provided code) and `client/src/pages/ResetPassword.jsx`.
- [x] **Routing**: Add the respective `/forgot-password` and `/reset-password/:token` routes to `App.jsx`.
- [x] **UI Link**: Add a "Forgot Password?" link to the existing `Login.jsx` form.

## Phase 9: HTML Email Templates
- [x] **Templates Definition**: Create `EmailTemplate.js` with the provided verification, welcome, and password reset HTML templates.
- [x] **Email Utility Update**: Update the email sender utility to use these specific HTML templates instead of plain text.
- [x] **Controller Updates**: Refactor `authController.js` to call the new specific email functions (`sendVerificationEmail`, `sendPasswordResetEmail`, `sendWelcomeEmail`).
