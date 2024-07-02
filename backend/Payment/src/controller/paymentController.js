const Payment = require('../model/paymentModel');
const moment = require('moment');
const querystring = require("qs");
const sha256 = require("sha256");
const qs = require('qs');
const crypto = require('crypto');
const { publishToQueue, consumeQueue, publishToExchange, consumeFromExchange } = require('../utils/amqp');
const PaymentModel = require("../model/paymentModel")
// Create a new payment

exports.createPaymentV2 = async (req, res) => {
    try {
        const { orderDetails, userId, amount } = req.body
        const currCode = "VND"
        await publishToQueue('orderCreateRequestQueue', {
            userId: userId,
            products: orderDetails
        });
        await consumeQueue('orderCreateResponseQueue', async (messageContent) => {
            const { orderId } = messageContent;

            const payment = await Payment.create({
                amount: amount,
                currency: currCode,
                paymentMethod: 'CashOnDelivery',
                status: 'pending',
                orderId,
            });
            res.status(201).json({
                status: 'success',
                data: payment
            });
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

const tmnCode = 'BFOVPGBI';
const secretKey = 'JPJI1NRURNH39ZRZOWQYKJ3Q7GWL5302';
const url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const returnUrl = 'http://localhost:3006/orderSuccess';

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
exports.createPayment = async (req, res) => {

    try {
       
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        const orderDetails = req.body.orderDetails;
        var emailUser = req.body.email;
        var amount = req.body.amount;
        var bankCode = "VNBANK";
        const userId = req.body.userId;
        var currCode = 'VND';

        var locale = req.body.language;
        if (!locale) {
            locale = 'vn';
        }

        await publishToExchange('orderExchange', 'order.create', {
            userId: userId,
            products: orderDetails,
            amount,
            emailUser
        });

        const orderCreateResponseHandler = async (messageContent) => {
            try {
                const { orderId } = messageContent;
                var orderInfo = `Nap tien cho userID: ${userId}. So tien ${amount} VND`;
                var orderType = 'thanhtoan';

                const paymentNew = new PaymentModel({
                    amount,
                    currency: currCode,
                    paymentMethod: 'VNPAY',
                    status: 'pending',
                    orderId,
                    orderInfo
                });

                await paymentNew.save();

                let vnpUrl = url;
                let date = new Date();
                let createDate = moment(date).format('YYYYMMDDHHmmss');
                var vnp_Params = {};
                vnp_Params['vnp_Version'] = '2.1.0';
                vnp_Params['vnp_Command'] = 'pay';
                vnp_Params['vnp_TmnCode'] = tmnCode;
                vnp_Params['vnp_Locale'] = locale;
                vnp_Params['vnp_CurrCode'] = currCode;
                vnp_Params['vnp_TxnRef'] = orderId;
                vnp_Params['vnp_OrderInfo'] = orderInfo;
                vnp_Params['vnp_OrderType'] = orderType;
                vnp_Params['vnp_Amount'] = amount * 100;
                vnp_Params['vnp_ReturnUrl'] = returnUrl;
                vnp_Params['vnp_IpAddr'] = ipAddr;
                vnp_Params['vnp_CreateDate'] = createDate;
                if (bankCode) {
                    vnp_Params['vnp_BankCode'] = bankCode;
                }

                vnp_Params = sortObject(vnp_Params);

                var signData = querystring.stringify(vnp_Params, { encode: false });
                var hmac = crypto.createHmac("sha512", secretKey);
                var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
                vnp_Params['vnp_SecureHash'] = signed;
                vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

                return res.status(200).json({ code: '00', data: vnpUrl });
            } catch (error) {
                return res.status(500).json({ message: 'Failed to process payment', error: error.message });
            }
        };
        await consumeFromExchange('orderExchange', 'order.create.response', 'orderResponseQueue', orderCreateResponseHandler);
        // return res.json({message: "ok"});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: payments
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get a single payment by ID
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: payment

        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Payment not found'
        });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Payment not found'
        });
    }
};

exports.returnPayment = async (req, res) => {
    console.log('returnPayment');
    try {
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];
        const orderId = vnp_Params['vnp_TxnRef'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const findPayment = await PaymentModel.findOne({ orderId })
            if (findPayment) {
                findPayment.status = 'completed';
                await findPayment.save();
            } else {
                console.log('Payment not found');
            }
            res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
        } else {
            res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
        }
    } catch (error) {
        console.error('Error in returnPayment:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.inpPayment = async (req, res) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({ RspCode: '00', Message: 'success' })
    }
    else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
};