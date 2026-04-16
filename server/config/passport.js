const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/User");
const Student = require("../models/Student");

// ─── Shared helper: find/create user from an OAuth profile ──────────────────
async function findOrCreateUser({ provider, providerId, email, displayName, firstName, lastName, avatar }) {
  // 1️⃣  Already linked to this provider
  const query = provider === "google" ? { googleId: providerId } : { linkedinId: providerId };
  let user = await User.findOne(query);
  if (user) return user;

  // 2️⃣  Email already exists → link provider to existing account
  user = await User.findOne({ email });
  if (user) {
    if (provider === "google") user.googleId = providerId;
    else user.linkedinId = providerId;
    if (!user.avatar && avatar) user.avatar = avatar;
    user.isVerified = true;
    await user.save();
    return user;
  }

  // 3️⃣  Brand-new user → create User + minimal Student record
  const name = displayName || `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0];

  const userData = {
    name,
    email,
    password: "OAUTH_NO_PASSWORD",
    role: "student",
    avatar: avatar || null,
    isVerified: true,
  };
  if (provider === "google") userData.googleId = providerId;
  else userData.linkedinId = providerId;

  user = new User(userData);
  await user.save();

  const student = new Student({
    user: user._id,
    email,
    firstName: firstName || name,
    lastName: lastName || "",
    rollNumber: email.split("@")[0],
    department: "General",
    year: new Date().getFullYear(),
    graduationYear: new Date().getFullYear(),
  });
  await student.save();

  return user;
}

// ─── GOOGLE STRATEGY ─────────────────────────────────────────────────────────
// Guard: only register if credentials are present in .env
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here") {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email returned from Google"), null);

          const user = await findOrCreateUser({
            provider: "google",
            providerId: profile.id,
            email,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value || null,
          });

          return done(null, user);
        } catch (err) {
          console.error("[GoogleStrategy] Error:", err.message);
          return done(err, null);
        }
      }
    )
  );
  console.log("[Passport] ✅ Google OAuth strategy registered");
} else {
  console.warn("[Passport] ⚠️  Google OAuth disabled — GOOGLE_CLIENT_ID not set in .env");
}

// ─── LINKEDIN STRATEGY ───────────────────────────────────────────────────────
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_ID !== "your_linkedin_client_id_here") {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/linkedin/callback`,
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email returned from LinkedIn"), null);

          const user = await findOrCreateUser({
            provider: "linkedin",
            providerId: profile.id,
            email,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value || null,
          });

          return done(null, user);
        } catch (err) {
          console.error("[LinkedInStrategy] Error:", err.message);
          return done(err, null);
        }
      }
    )
  );
  console.log("[Passport] ✅ LinkedIn OAuth strategy registered");
} else {
  console.warn("[Passport] ⚠️  LinkedIn OAuth disabled — LINKEDIN_CLIENT_ID not set in .env");
}

// Minimal serialization (required by passport even without sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
