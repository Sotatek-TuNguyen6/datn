module.exports = function(notification) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Notification</h2>
            <p>Dear User,</p>
            <p>${notification.message}</p>
            <p>Thank you for using our service.</p>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        </div>
    `;
};
