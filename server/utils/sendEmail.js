const { transporter } = require("./Email.config.js");
const {
  Verification_Email_Template,
  Welcome_Email_Template,
  Password_Reset_Email_Template,
  Drive_Status_Email_Template,
} = require("./EmailTemplate.js");

const COMPANY_NAME = process.env.COMPANY_NAME || "SkillBridge";

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode,
      ),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Email error", error);
    throw new Error("Failed to send verification email");
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email, // list of receivers
      subject: `Welcome to ${COMPANY_NAME}`, // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Email error", error);
    throw new Error("Failed to send welcome email");
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Reset Your Password - ${COMPANY_NAME}`,
      text: `Click the following link to reset your password: ${resetLink}`,
      html: Password_Reset_Email_Template.replace("{resetLink}", resetLink),
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Password reset email error", error);
    throw new Error("Failed to send password reset email");
  }
};

const sendDriveStatusEmail = async (email, studentName, driveTitle, companyName, newStatus) => {
  try {
    const html = Drive_Status_Email_Template
      .replace("{studentName}", studentName || "Student")
      .replace("{driveTitle}", driveTitle || "Campus Placement Drive")
      .replace("{companyName}", companyName || "Partner Recruiter")
      .replace("{newStatus}", newStatus);

    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Drive Status Update: ${newStatus} - ${companyName || COMPANY_NAME}`,
      text: `Hello ${studentName}, your status for ${driveTitle} has been updated to: ${newStatus}.`,
      html,
    });
    console.log("✅ Drive status notification email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Drive status notification email error:", error.message);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDriveStatusEmail,
};
