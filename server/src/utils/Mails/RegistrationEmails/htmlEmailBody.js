function getHtml(name, password, email) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Successful Registration - Placements Drive</title>
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
                background-color: #4CAF50;
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
            .credentials {
                background-color: #e9e9e9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .security-advice {
                margin-top: 20px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            .important-notice {
                background-color: #ffeeee;
                border: 2px solid #ff0000;
                color: #ff0000;
                font-weight: bold;
                padding: 15px;
                margin-top: 20px;
                border-radius: 5px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Welcome to the Placements Drive!</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>Congratulations! Your registration for the Placements Drive has been successful. We're excited to have you on board and wish you the best of luck in your upcoming interviews and assessments.</p>
            
            <div class="important-notice">
                <p>IMPORTANT: Please change your password and upload your profile image and Resume as soon as possible!</p>
            </div>
            
            <div class="credentials">
                <h2>Your Login Credentials</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
            </div>
            
            <div class="security-advice">
                <h2>Important Security Advice</h2>
                <ul>
                    <li><strong>Change your password immediately:</strong> For your security, please change your password as soon as possible after your first login.</li>
                    <li><strong>Upload your profile image:</strong> To complete your profile, please upload a clear, professional image of yourself.</li>
                    <li><strong>Use a strong password:</strong> Choose a password that is at least 12 characters long, including uppercase and lowercase letters, numbers, and symbols.</li>
                    <li><strong>Keep your credentials confidential:</strong> Never share your login information with anyone.</li>
                    
                </ul>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Placements Team</p>
        </div>
    </body>
    </html>`
}

module.exports = getHtml