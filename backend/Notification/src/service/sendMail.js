const transporter = require('../config/nodeMailer');
const notificationEmailTemplate = require('../templates/notificationEmail');

async function sendEmail(notification, recipientEmail) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'New Notification',
        html: notificationEmailTemplate(notification)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
