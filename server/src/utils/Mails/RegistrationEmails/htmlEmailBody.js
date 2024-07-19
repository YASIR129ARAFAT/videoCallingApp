function getHtml(name, userType) {
    if (userType === 'patient') {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TeleMed Connect</title>
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
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #34495e;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .important {
            font-weight: bold;
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to TeleMed Connect!</h1>
    </div>
    <div class="content">
        <p>Dear ${name},</p>
        
        <p>Thank you for registering with TeleMed Connect, your trusted platform for remote healthcare services. We're excited to have you join our community of patients and healthcare providers.</p>
        
        <h2>Important Next Steps:</h2>
        <ol>
            <li><strong>Complete Your Profile:</strong> Please log in and fill out your medical history, current medications, and any relevant health information. This will help our healthcare providers serve you better.</li>
            <li><strong>Upload a Profile Picture:</strong> A clear, recent photo helps our doctors connect with you more personally during video consultations.</li>
            <li><strong>Verify Your Information:</strong> Ensure all your contact details are up-to-date, including your phone number and address.</li>
            <li><strong>Explore Our Services:</strong> Familiarize yourself with our range of telehealth services, including video consultations, prescription renewals, and health monitoring tools.</li>
            <li><strong>Schedule Your First Appointment:</strong> Once your profile is complete, you can book your first virtual consultation with one of our qualified healthcare professionals.</li>
        </ol>
        
        <h2>Security Reminders:</h2>
        <ul>
            <li>Use a strong, unique password for your account.</li>
            <li>Never share your login credentials with anyone.</li>
            <li>Always access our platform through the official website or app.</li>
        </ul>
        
        
        
        <p>We look forward to providing you with high-quality, convenient healthcare services.</p>
        
        <p>Best regards,<br>The TeleMed Connect Team</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 TeleMed Connect. All rights reserved.</p>
    </div>
</body>
</html>`
    }
    else {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TeleMed Connect - Healthcare Provider</title>
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
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #34495e;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .important {
            font-weight: bold;
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to TeleMed Connect!</h1>
    </div>
    <div class="content">
        <p>Dear Dr. ${name},</p>
        
        <p>Welcome to TeleMed Connect! We are thrilled to have you join our network of healthcare professionals. Your expertise and dedication to patient care will be invaluable in our mission to provide high-quality telemedicine services.</p>
        
        <h2>Next Steps to Get Started:</h2>
        <ol>
            <li><strong>Complete Your Profile:</strong> Please log in and upload your recent image</li>

            <li><strong>Keep updated: </strong> Please keep your contact details updated.</li>
            
        </ol>
        
        <h2>Important Reminders:</h2>
        <ul>
            <li>Ensure your internet connection is stable and your equipment (camera, microphone) is functioning properly before each consultation.</li>
            <li>Maintain patient confidentiality and adhere to all relevant healthcare regulations and our platform's privacy policies.</li>
            <li>Regularly update your profile and availability to provide the best service to patients.</li>
        </ul>
        
        
        
        <p>We look forward to working with you to revolutionize healthcare delivery through telemedicine.</p>
        
        <p>Best regards,<br>The TeleMed Connect Team</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 TeleMed Connect. All rights reserved.</p>
    </div>
</body>
</html>`
    }
}

module.exports = getHtml