export const verificationMailTemplate = (
  firstname: string,
  verificationUrl: string,
) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email - Foodly</title>
  <style>
    body {
      background-color: #f4f4f7;
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background: #fff;
      margin: 0 auto;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      padding: 20px;
    }
    .logo {
      max-width: 200px;
    }
    h1 {
      font-size: 24px;
      margin: 20px 0 10px;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
      margin: 15px 0;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      background-color: #ff6b00;
      color: #fff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #999;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <img src="https://yourcdn.com/logo.png" alt="QuickBite" class="logo" />
    </div>

    <!-- Title -->
    <h1>Verify Your Email</h1>

    <!-- Greeting -->
    <p>Hello ${firstname},</p>

    <!-- Instructions -->
    <p>
      Thank you for signing up for QuickBite! Please verify your email address to activate your account and start ordering your favorite meals without the wait. The link will expire after 15 minutes.
    </p>

    <!-- CTA Button -->
    <div class="button-container">
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </div>

    <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">
      <a href="${verificationUrl}">${verificationUrl}</a>
    </p>

    <p>If you did not create an account, you can safely ignore this email.</p>

    <!-- Footer -->
    <div class="footer">
      QuickBite Inc.<br>
      123 Food Street, Flavor City, FC 12345
    </div>
  </div>
</body>
</html>
`;
