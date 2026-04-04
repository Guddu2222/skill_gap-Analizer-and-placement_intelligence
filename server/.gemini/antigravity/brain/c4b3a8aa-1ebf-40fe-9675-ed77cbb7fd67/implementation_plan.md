# Profile Image & Gmail Integration Plan

## 1. Goal
Integrate the provided Gmail App Password to successfully deliver verification emails. Implement "Profile Image" logic to allow users to upload a profile picture during signup, storing it securely in Cloudinary.

## 2. Proposed Changes

### Backend (Node.js/Express)
#### [MODIFY] [.env](file:///d:/project/Smart%20Expense%20Manager/server/.env)
- Remove Mailtrap placeholders and add Gmail + Cloudinary credentials.

#### [MODIFY] [sendEmail.js](file:///d:/project/Smart%20Expense%20Manager/server/utils/sendEmail.js)
- Refactor the nodemailer transport configuration to use `service: 'gmail'` and the provided user/app password.

#### [NEW] [cloudinary.js](file:///d:/project/Smart%20Expense%20Manager/server/config/cloudinary.js)
- Initialize the Cloudinary V2 SDK with the credentials.
- Set up `multer-storage-cloudinary` to create a Multer middleware capable of directly piping incoming image uploads to a specific Cloudinary folder (e.g., `smart_expense_profiles`).

#### [MODIFY] [User.js](file:///d:/project/Smart%20Expense%20Manager/server/models/User.js)
- Add `profileImage: { type: String, default: '' }` to store the Cloudinary secure URL.

#### [MODIFY] [authRoutes.js](file:///d:/project/Smart%20Expense%20Manager/server/routes/authRoutes.js)
- Import the Multer upload middleware and apply it to the `router.post('/register', upload.single('profileImage'), registerUser)`.

#### [MODIFY] [authController.js](file:///d:/project/Smart%20Expense%20Manager/server/controllers/authController.js)
- In `registerUser`, extract `req.file?.path`. If present, assign it to the new user's `profileImage` field.

### Frontend (React/Vite)
#### [MODIFY] [Register.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/pages/Register.jsx)
- Add a file input loop and state for `profileImage`.
- Include a small circular UI preview of the image above the form fields.
- Update the `handleSubmit` to build a `FormData` object instead of a JSON payload when calling the register API.

#### [MODIFY] [AuthContext.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/context/AuthContext.jsx)
- Modify `register` function to accept `FormData` and pass it directly to `api.post`.

#### [MODIFY] [DashboardLayout.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/components/DashboardLayout.jsx) 
- (Or `App.jsx` dummy content if layout is missing) Update to fetch the authenticated user's `profileImage` and display it in a user avatar circle.

## 3. Verification Plan
- **Backend Email**: Create a new account with a valid email. Check my Gmail sent folder/inbox to verify actual delivery of the verification token.
- **Image Upload**: Upload a PNG image during registration. Check Cloudinary dashboard for the new asset.
- **UI Validation**: Verify the user avatar renders in the frontend upon successful login.

## 4. Forgot / Reset Password Additions
### Backend
#### [MODIFY] [User.js](file:///d:/project/Smart%20Expense%20Manager/server/models/User.js)
- Add the `getResetPasswordToken` instance method to generate a hashed token using the `crypto` module.
- Add `resetPasswordToken` and `resetPasswordExpire` fields to the Schema.

#### [MODIFY] [authController.js](file:///d:/project/Smart%20Expense%20Manager/server/controllers/authController.js)
- Implement `forgotPassword`: generates a token from the model, constructs a frontend reset URL, and emails it.
- Implement `resetPassword`: hashes the incoming URL token to find a matching active token in DB. Overwrites `user.password` with the new value, clears tokens, and saves.

#### [MODIFY] [authRoutes.js](file:///d:/project/Smart%20Expense%20Manager/server/routes/authRoutes.js)
- Add routes for the two new controller functions. 

### Frontend
#### [NEW] [ForgotPassword.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/pages/ForgotPassword.jsx)
- Use the user-provided layout utilizing `lucide-react`. Fix any incorrect API calls (e.g., replace `api.post('/auth/forgot-password')` if needed based on the unified Axios standard).

#### [NEW] [ResetPassword.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/pages/ResetPassword.jsx)
- Implement a form extracting the `:token` parameter from `react-router-dom` to submit the new password back to the server via a PUT request.

#### [MODIFY] [App.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/App.jsx)
- Define `<Route path="/forgot-password" element={<ForgotPassword />} />` and `<Route path="/reset-password/:token" element={<ResetPassword />} />`.

#### [MODIFY] [Login.jsx](file:///d:/project/Smart%20Expense%20Manager/client/src/pages/Login.jsx)
- Inject a "Forgot your password?" router `<Link>` underneath or beside the password input field.
