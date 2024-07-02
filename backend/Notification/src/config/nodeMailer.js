const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || "nguyendinhtu11022002@gmail.com",
        pass: process.env.EMAIL_PASS || "dipotwokkbgjlryq"
    }
});

module.exports = transporter;
