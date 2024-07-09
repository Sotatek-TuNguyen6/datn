const amqp = require('amqplib');
const logger = require('../utils/logger');
const Payment = require("../model/paymentModel")

async function handleCreatePaymentRequest({ userId, orderId, products, amount, emailUser }) {
    try {
        if (userId && products) {
            var orderInfo = `Nap tien cho userID: ${userId}. So tien ${amount} VND`;
            var currCode = 'VND';

            const newPayment = new Payment({
                amount,
                currency: currCode,
                paymentMethod: 'VNPAY',
                status: 'pending',
                orderId,
                orderInfo
            });

            const savedOrder = await newPayment.save();

            logger.info('Payment created successfully:', savedOrder);
            return true;
        }
        logger.info('Start!!', {});
        return false
    } catch (error) {
        logger.error('Error handling create order request:', error);
        return false
    }
}

async function handleUpdateStatusPayment({ orderId }) {
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { orderId },
            { status: "completed" },
            { new: true }
        );

        if (updatedPayment) {
            logger.info('Payment updated successfully:', updatedPayment);
        } else {
            logger.warn('No payment found with the given orderId:', orderId);
        }
    } catch (error) {
        logger.error('Error handling create order request:', error);
    }
}
module.exports = { handleCreatePaymentRequest, handleUpdateStatusPayment }