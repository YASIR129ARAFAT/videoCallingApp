function getForgotPasswordHtml(resetLink) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Placements Drive</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3498db;
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .reset-link {
            background-color: #e9e9e9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .expiry-notice {
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset Request</h1>
    </div>
    <div class="content">
        <p>Dear User,</p>
        <p>We received a request to reset the password for your Placements Drive account. If you didn't make this request, please ignore this email.</p>
        
        <div class="reset-link">
            <h2>Reset Your Password</h2>
            <p>To reset your password, please click on the button below:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
        </div>
        
        <div class="expiry-notice">
            <p><strong>Please note:</strong> This password reset link will expire in 4 hours for security reasons. If you need to reset your password after this time, you'll need to submit a new request.</p>
        </div>
        
        <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
        <p>${resetLink}</p>
        
        <p>For security reasons, please remember to:</p>
        <ul>
            <li>Use a strong, unique password that you don't use for other accounts.</li>
            <li>Never share your password with anyone.</li>
        </ul>
        
        <p>Best regards,<br>The Placements Drive Team</p>
    </div>
</body>
</html>`
}

module.exports = getForgotPasswordHtml