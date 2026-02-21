const { transporter } = require('./Email.config.js');
const { Verification_Email_Template, Welcome_Email_Template } = require('./EmailTemplate.js');

const COMPANY_NAME = process.env.COMPANY_NAME || "Placement Intelligence";

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.log('Email error', error);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: email, // list of receivers
      subject: `Welcome to ${COMPANY_NAME}`, // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name)
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.log('Email error', error);
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
