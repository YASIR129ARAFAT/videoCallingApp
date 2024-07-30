function getAppointmentScheduledHtml(appointmentDetails) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Scheduled - TeleMed</title>
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
        .appointment-details {
            background-color: #e9e9e9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .reminder {
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Appointment Scheduled</h1>
    </div>
    <div class="content">
        <p>Dear ${appointmentDetails?.clientId?.name},</p>
        <p>Your appointment has been successfully scheduled with TeleMed. Here are the details:</p>
        
        <div class="appointment-details">
            <h2>Appointment Information</h2>
            <p><strong>Date and Time:</strong> ${appointmentDetails?.apptDate}</p>
            <p><strong>Professional:</strong> ${appointmentDetails?.professionalId?.name}</p>
        </div>
        
        <div class="reminder">
            <p><strong>Please note:</strong> If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</p>
        </div>
        
        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        
        <p>Thank you for choosing TeleMed for your healthcare needs.</p>
        
        <p>Best regards,<br>The TeleMed Team</p>
    </div>
</body>
</html>`
}

module.exports = getAppointmentScheduledHtml;