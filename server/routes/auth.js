const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

// ── Existing credential-based routes ─────────────────────────────────────────
router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/check-email", authController.checkEmail);

// ── Helper: build redirect URL with JWT ──────────────────────────────────────
const buildRedirectUrl = (user) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const payload = { userId: user.id, role: user.role };
  if (user.role === "college_admin" && user.college) {
    payload.collegeId = user.college.toString();
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });

  const params = new URLSearchParams({
    token,
    role: user.role,
    userId: user.id,
  });

  return `${frontendUrl}/oauth-callback?${params.toString()}`;
};

// ── Google OAuth ──────────────────────────────────────────────────────────────
// Guard: return friendly error if credentials not yet configured
const googleConfigured = () =>
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here";

const linkedinConfigured = () =>
  process.env.LINKEDIN_CLIENT_ID &&
  process.env.LINKEDIN_CLIENT_ID !== "your_linkedin_client_id_here";

// Step 1: Redirect user to Google consent screen
router.get("/google", (req, res, next) => {
  if (!googleConfigured()) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/oauth-callback?error=${encodeURIComponent(
        "Google login is not configured yet. Please add GOOGLE_CLIENT_ID to the server .env file."
      )}`
    );
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

// Step 2: Google redirects back here with ?code=...
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-callback?error=Google+authentication+failed`,
  }),
  (req, res) => {
    try {
      const redirectUrl = buildRedirectUrl(req.user);
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("[Google Callback] Error:", err.message);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/oauth-callback?error=${encodeURIComponent(err.message)}`);
    }
  }
);

// ── LinkedIn OAuth ────────────────────────────────────────────────────────────
// Step 1: Redirect user to LinkedIn consent screen
router.get("/linkedin", (req, res, next) => {
  if (!linkedinConfigured()) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/oauth-callback?error=${encodeURIComponent(
        "LinkedIn login is not configured yet. Please add LINKEDIN_CLIENT_ID to the server .env file."
      )}`
    );
  }
  passport.authenticate("linkedin", { session: false })(req, res, next);
});

// Step 2: LinkedIn redirects back here with ?code=...
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-callback?error=LinkedIn+authentication+failed`,
  }),
  (req, res) => {
    try {
      const redirectUrl = buildRedirectUrl(req.user);
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("[LinkedIn Callback] Error:", err.message);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/oauth-callback?error=${encodeURIComponent(err.message)}`);
    }
  }
);

module.exports = router;
