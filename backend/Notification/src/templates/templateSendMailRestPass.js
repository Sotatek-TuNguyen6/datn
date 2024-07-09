module.exports = function (resetLink) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 50px auto;
                border-radius: 8px;
            }
            .header {
                text-align: center;
                padding: 10px 0;
                background-color: #4CAF50;
                color: white;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
            }
            .content p {
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                font-size: 16px;
                color: white;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #777777;
                padding: 10px 0;
                border-top: 1px solid #dddddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hi,</p>
                <p>We received a request to reset your password. Click the button below to reset your password:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>If you didn't request a password reset, please ignore this email or let us know. This password reset link is only valid for the next 10 minutes.</p>
                <p>Thanks,</p>
                <p>Your Company Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2023 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}