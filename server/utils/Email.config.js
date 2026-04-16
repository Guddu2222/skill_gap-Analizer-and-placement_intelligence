const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    // Gmail App Passwords: strip spaces (e.g. "nbku fyxx tenr egge" → "nbkufyxxtenregge")
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, "") : "",
  },
});

// Verify SMTP connection on startup — logs clearly so you know immediately if it's broken
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ [Email] SMTP connection FAILED:", error.message);
    console.error(
      "   → Check EMAIL_USER and EMAIL_PASS in your .env file.",
      "\n   → Make sure you're using a Gmail App Password (not your regular password).",
      "\n   → Enable 2FA on Gmail first, then generate an App Password at: https://myaccount.google.com/apppasswords"
    );
  } else {
    console.log("✅ [Email] SMTP server is ready — emails will be delivered.");
  }
});

module.exports = { transporter };
