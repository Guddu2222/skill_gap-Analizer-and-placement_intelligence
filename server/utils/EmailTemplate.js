const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Our Community!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
              <p>Here’s how you can get started:</p>
              <ul>
                  <li>Explore our features and customize your experience.</li>
                  <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                  <li>Reach out to our support team if you have any questions or need assistance.</li>
              </ul>
              <a href="#" class="button">Get Started</a>
              <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          </div>
      </div>
    </html>
`;

const Password_Reset_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #ddd; }
          .header { background-color: #007BFF; color: white; padding: 20px; text-align: center; font-size: 26px; font-weight: bold; }
          .content { padding: 25px; line-height: 1.8; text-align: center; }
          .button { display: inline-block; padding: 12px 25px; margin: 20px 0; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; transition: background-color 0.3s; }
          .button:hover { background-color: #0056b3; }
          .footer { background-color: #f4f4f4; padding: 15px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd; }
          p { margin: 0 0 15px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Reset Your Password</div>
          <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
              <a href="{resetLink}" class="button">Reset Password</a>
              <p>If you did not request a password reset, please ignore this email. This link will expire in 1 hour.</p>
          </div>
          <div class="footer">
              <p>&copy; 2026 SkillBridge. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

const Drive_Status_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Campus Drive Status Update</title>
      <style>
          body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 24px; text-align: center; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; line-height: 1.8; }
          .status-badge { display: inline-block; padding: 8px 18px; margin: 15px 0; font-size: 16px; font-weight: bold; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; }
          .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
          p { margin: 0 0 12px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Campus Drive Status Update</div>
          <div class="content">
              <p>Hello <strong>{studentName}</strong>,</p>
              <p>Your application status for the campus recruitment drive has been updated!</p>
              
              <div class="details-box">
                  <p><strong>Drive Title:</strong> {driveTitle}</p>
                  <p><strong>Company:</strong> {companyName}</p>
                  <p><strong>New Status:</strong> <span class="status-badge">{newStatus}</span></p>
              </div>

              <p>Please log in to your <strong>SkillBridge Dashboard</strong> to view full details and next steps for your drive application.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SkillBridge Placement Intelligence Platform. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

module.exports = {
  Verification_Email_Template,
  Welcome_Email_Template,
  Password_Reset_Email_Template,
  Drive_Status_Email_Template,
};
