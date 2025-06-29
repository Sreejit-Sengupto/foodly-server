export const welcomeEmailTemplate = (username: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to QuickBite - Skip the queue, savor the flavor!</title>
    <style>
      body {
        background-color: #f4f4f7;
        color: #333;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
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
      .h1 {
        font-size: 24px;
        margin: 20px 0 10px;
      }
      .hero-text {
        font-size: 16px;
        color: #555;
      }
      .paragraph {
        font-size: 14px;
        line-height: 1.5;
        margin: 15px 0;
      }
      .feature {
        display: flex;
        align-items: flex-start;
        margin: 15px 0;
      }
      .feature-icon {
        font-size: 24px;
        margin-right: 10px;
      }
      .feature-title {
        font-weight: bold;
        margin: 0;
      }
      .feature-description {
        margin: 2px 0 0;
        font-size: 13px;
        color: #555;
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
      .hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 30px 0;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
      }
      .social-links a {
        color: #ff6b00;
        text-decoration: none;
        margin: 0 5px;
      }
      .unsubscribe a {
        color: #999;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img src="https://yourcdn.com/logo.png" alt="QuickBite" class="logo" />
      </div>

      <!-- Hero Section -->
      <h1 class="h1">Welcome to QuickBite, ${username}! 🍕</h1>
      <p class="hero-text">Say goodbye to long queues and hello to hot, fresh food waiting just for you.</p>

      <!-- Content -->
      <p class="paragraph">
        We're thrilled to have you join our community of smart food lovers who value their time as much as great taste.
      </p>

      <p class="paragraph">
        <strong>Here's how QuickBite works:</strong>
      </p>

      <!-- Features -->
      <div class="feature">
        <div class="feature-icon">📱</div>
        <div>
          <p class="feature-title">Browse & Order</p>
          <p class="feature-description">Explore your favorite restaurants and place your order in seconds.</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">⏰</div>
        <div>
          <p class="feature-title">Set Arrival Time</p>
          <p class="feature-description">Tell us when you'll arrive and we'll have your food ready.</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🔥</div>
        <div>
          <p class="feature-title">Skip the Queue</p>
          <p class="feature-description">Walk in, grab your hot fresh meal, and walk out—no waiting!</p>
        </div>
      </div>

      <p class="paragraph">
        Ready to experience the future of food ordering? Your favorite restaurants are waiting for you.
      </p>

      <!-- CTA Button -->
      <div class="button-container">
        <a href="https://quickbite.app/restaurants" class="button">Start Ordering Now</a>
      </div>

      <p class="paragraph">
        <strong>Pro tip:</strong> Download our mobile app for even faster ordering and exclusive deals!
      </p>

      <hr class="hr" />

      <!-- Footer -->
      <div class="footer">
        <p>
          Questions? We're here to help! Reply to this email or visit our
          <a href="https://quickbite.app/help">Help Center</a>.
        </p>
        <p>Follow us for the latest updates:</p>
        <div class="social-links">
          <a href="https://twitter.com/quickbite">Twitter</a> |
          <a href="https://instagram.com/quickbite">Instagram</a> |
          <a href="https://facebook.com/quickbite">Facebook</a>
        </div>
        <p>QuickBite Inc. • 123 Food Street, Flavor City, FC 12345</p>
        <p class="unsubscribe">
          <a href="https://quickbite.app/unsubscribe">Unsubscribe</a> •
          <a href="https://quickbite.app/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  </body>
</html>
`