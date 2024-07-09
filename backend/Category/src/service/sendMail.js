const transporter = require('../config/nodeMailer');
const notificationEmailTemplate = require('../templates/notificationEmail');
const templatesSendOrder = require('../templates/templatesSendOrder');
const templateSendMailRestPass = require('../templates/templateSendMailRestPass');
const logger = require('../utils/logger');

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

async function sendEmailOrder(notification, recipientEmail) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'New Notification',
        html: templatesSendOrder(notification)
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
async function sendEmailResetPass(resetLink, recipientEmail) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Password Reset Request',
        html: templateSendMailRestPass(resetLink)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


module.exports = { sendEmail, sendEmailResetPass, sendEmailOrder };
