const Order = require('../model/orderModel'); // Adjust the path as needed
const { publishToExchange, consumeFromExchange } = require('../utils/amqp');
const logger = require('../utils/logger'); // Adjust the path as needed
const redisClient = require('../utils/redisClient');
const querystring = require("qs");
const crypto = require('crypto');
const moment = require('moment');

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

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const cachedOrders = await redisClient.get('orders');
        if (cachedOrders) {
            const orders = JSON.parse(cachedOrders);
            if (orders.length > 0) {
                res.status(200).json(orders);
                logger.info("Retrieved all orders from cache");
                return;
            }
        }

        const orders = await Order.find();
        await redisClient.setEx('orders', 10, JSON.stringify(orders));

        res.status(200).json(orders);
        logger.info("Retrieved all orders from database:", orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
        logger.error("Error retrieving orders:", error);
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error: error.message });
        logger.error("Error retrieving order:", error);
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        var orderType = 'thanhtoan';

        // var emailUser = req.body.email;
        var amount = req.body.amount;
        var bankCode = "VNBANK";
        var currCode = 'VND';
        var locale = req.body.language;
        if (!locale) {
            locale = 'vn';
        }

        const { id, email } = req.user
        const { products, userId, addresses } = req.body
        const newOrder = new Order({ products, userId });

        const savedOrder = await newOrder.save();
        logger.info("Created new order:", savedOrder);

        await publishToExchange('orderExchange', 'order.create', {
            userId: userId,
            products,
            amount,
            emailUser: email,
            orderId: savedOrder._id,
            addresses
        });

        var orderInfo = `Nap tien cho userID: ${userId}. So tien ${amount} VND`;

        let vnpUrl = url;
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = savedOrder._id;
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

        // Invalidate cache
        await redisClient.del('orders');


        return res.status(200).json({ code: '00', data: vnpUrl });

    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
        logger.error("Error creating order:", error);
    }
};

// Update an existing order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        // Invalidate cache
        await redisClient.del('orders');

        res.status(200).json(updatedOrder);
        logger.info("Updated order:", updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
        logger.error("Error updating order:", error);
    }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        // Invalidate cache
        await redisClient.del('orders');

        res.status(200).json({ message: "Order deleted successfully" });
        logger.info("Deleted order:", deletedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
        logger.error("Error deleting order:", error);
    }
};


exports.returnPayment = async (req, res) => {
    const { email } = req.user
    try {
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];
        const orderId = vnp_Params['vnp_TxnRef'];
        const amount = vnp_Params['vnp_Amount'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const getOrder = await Order.findById(orderId)
            await publishToExchange('orderExchange', 'order.update', {
                orderId,
                type: 'orderSuccess',
                products: getOrder.products,
                emailUser: email,
                amount,
                userId: getOrder.userId
            });
            // const findPayment = await PaymentModel.findOne({ orderId })
            // if (findPayment) {
            //     findPayment.status = 'completed';
            //     await findPayment.save();
            // } else {
            //     console.log('Payment not found');
            // }
            res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
        } else {
            await publishToExchange('orderExchange', 'order.delete', {
                orderId,
                type: 'orderFail',
                products: getOrder.products,
                emailUser: email,
                amount,
                userId: getOrder.userId
            });
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