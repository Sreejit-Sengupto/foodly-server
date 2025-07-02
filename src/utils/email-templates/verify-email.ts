export const verificationMailTemplate = (firstname: string, otp: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your One-Time Password</title>
    <style>
      body {
        background: #f9fafb;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 24px;
      }
      .otp {
        display: inline-block;
        font-size: 24px;
        letter-spacing: 8px;
        background: #f3f4f6;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 24px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
      .button {
        display: inline-block;
        margin-top: 24px;
        padding: 12px 20px;
        background: #ea580c;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://yourapp.com/logo.png" alt="Foodly" width="120" />
      </div>
      <h2 style="text-align:center;">Your One-Time Password</h2>
      <p>Hello ${firstname},</p>
      <p>Use the following OTP to complete your action. This code will expire in 10 minutes.</p>
      <div style="text-align:center;">
        <div class="otp">${otp}</div>
      </div>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <div class="footer">
        &copy; 2025 Foodly Inc. All rights reserved.
      </div>
    </div>
  </body>
</html>

`;
