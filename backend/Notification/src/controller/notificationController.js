const Notification = require('../models/NotificationModel');

exports.getNotifications = async (req, res) => {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
};

exports.createNotification = async (req, res) => {
    const notification = new Notification(req.body);
    await notification.save();
    res.json(notification);
};

exports.updateNotificationStatus = async (req, res) => {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { status: 'sent', sentAt: new Date() }, { new: true });
    res.json(notification);
};
