# OAuth Social Login — Google & LinkedIn

## Overview

The UI already has Google and LinkedIn buttons on the sign-in page that call
`window.location.href = "http://localhost:5000/api/auth/google"` and
`"/api/auth/linkedin"` — but the backend routes **don't exist yet**.

This plan wires up the full **OAuth 2.0 Authorization Code flow** using
[`passport.js`](http://www.passportjs.org/) — the de-facto standard for NodeJS
OAuth — with `passport-google-oauth20` and `passport-linkedin-oauth2`.

---

## How OAuth Works (for your understanding)

```
User clicks "Sign in with Google"
      ↓
Browser → Google's login page  (Google's server)
      ↓
User approves → Google redirects back to YOUR server with a ?code=...
      ↓
Your server exchanges the code for an access_token (server-to-server)
      ↓
Your server fetches user profile (name, email, picture) from Google
      ↓
Your server finds/creates a User in MongoDB, issues a JWT
      ↓
Your server redirects browser → frontend  with JWT in URL query param
      ↓
Frontend reads JWT from URL, stores in localStorage, redirects to dashboard
```

> [!IMPORTANT]
> **You need to create OAuth App credentials on Google Cloud Console and
> LinkedIn Developer Portal.** The steps are documented below, they are
> free and take ~5 minutes each.

---

## User Review Required

> [!WARNING]
> **Social login will only work for the `student` role by default.**  
> Recruiters and College Admins must still use email/password signup
> because their profiles need extra info (company name, college name, etc.).
> The OAuth callback will set `role = "student"` for new social users.
> This is the standard approach (e.g., how LinkedIn itself handles it).

> [!IMPORTANT]
> **Two things you must do before testing** (both free):
> 1. Create a Google OAuth App → get `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
> 2. Create a LinkedIn OAuth App → get `LINKEDIN_CLIENT_ID` + `LINKEDIN_CLIENT_SECRET`
> 
> Instructions are in the **Verification Plan** section below.

---

## Proposed Changes

### Backend — Dependencies

Install two passport strategies + passport itself:
```
npm install passport passport-google-oauth20 passport-linkedin-oauth2
```

---

### Backend — Models

#### [MODIFY] [User.js](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/server/models/User.js)

Add optional OAuth fields so a user can link Google/LinkedIn without a password:
- `googleId` — stores Google's unique user ID
- `linkedinId` — stores LinkedIn's unique user ID
- `avatar` — profile picture URL from OAuth provider
- Make `password` **optional** (social users have no password)

---

### Backend — Passport Config

#### [NEW] `server/config/passport.js`

Configure both OAuth strategies:
- **GoogleStrategy** — callback: `/api/auth/google/callback`
- **LinkedInStrategy** — callback: `/api/auth/linkedin/callback`

Each strategy:
1. Checks if a user with that `googleId`/`linkedinId` exists → log them in
2. Else checks if email already exists → links social login to existing account
3. Else creates a new User + Student record (auto-verified, no email code needed)
4. Returns the user to the route handler

---

### Backend — Auth Routes

#### [MODIFY] [auth.js](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/server/routes/auth.js)

Add 4 new routes:
```
GET /api/auth/google          → redirects to Google consent screen
GET /api/auth/google/callback → Google calls this after user approves
GET /api/auth/linkedin        → redirects to LinkedIn consent screen  
GET /api/auth/linkedin/callback → LinkedIn calls this after user approves
```

The callback routes will:
1. Issue a JWT (same as normal login)
2. Redirect to `FRONTEND_URL/oauth-callback?token=JWT&role=student`

---

### Backend — Server Entry Point

#### [MODIFY] [index.js](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/server/index.js)

- Initialize `passport` middleware
- Load `passport.js` config

---

### Backend — .env

#### [MODIFY] `.env`

Add 5 new variables:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
FRONTEND_URL=http://localhost:5173
```

---

### Frontend — OAuth Callback Page

#### [NEW] `client/src/pages/OAuthCallbackPage.jsx`

A lightweight page at route `/oauth-callback` that:
1. Reads `?token=` and `?role=` from the URL
2. Stores them in `localStorage`
3. Redirects to the correct dashboard (`/student`, `/recruiter`, etc.)
4. Shows a loading spinner while processing

---

### Frontend — App Router

#### [MODIFY] [App.jsx](file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/App.jsx)

Add route: `<Route path="/oauth-callback" element={<OAuthCallbackPage />} />`

---

### Frontend — SignInPage (already done, no changes needed)

The `handleGoogleLogin` and `handleLinkedInLogin` functions already point to
the correct backend URLs. ✅

---

## Verification Plan

### Step 1 — Get Google Credentials (5 minutes, free)

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy `Client ID` and `Client Secret` → paste in `.env`

### Step 2 — Get LinkedIn Credentials (5 minutes, free)

1. Go to [https://www.linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
2. Click **Create App**
3. Fill in app name, LinkedIn page (can be your own profile), logo
4. Under **Auth** tab → add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
5. Under **Products** → request access to **Sign In with LinkedIn using OpenID Connect**
6. Copy `Client ID` and `Client Secret` → paste in `.env`

### Step 3 — Test the flow

1. Restart the server
2. Click "Sign in with Google" on the login page
3. You should be redirected to Google → approve → auto-logged in to student dashboard

---

## Open Questions

> [!NOTE]
> **LinkedIn OAuth note**: LinkedIn's newer API uses OpenID Connect (OIDC).
> I will use `passport-linkedin-oauth2` which handles this correctly.
> If you encounter issues, the fallback is to use the
> `openid-client` package instead.
