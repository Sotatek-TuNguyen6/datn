const express = require("express");
const { createPayment, getPayment, getAllPayments, updatePayment, deletePayment, returnPayment, inpPayment, createPaymentV2 } = require("../controller/paymentController");
const router = express.Router();
const crypto = require('crypto');
const qs = require('qs');
const moment = require('moment');

const config = {
    vnp_TmnCode: 'BFOVPGBI',
    vnp_HashSecret: 'JPJI1NRURNH39ZRZOWQYKJ3Q7GWL5302',
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'http://localhost:3006/',
};

// router.post("/", createPayment);
// router.post("/create", createPaymentV2);
// router.get("/vnpay_return", returnPayment)
// router.get("/vnpay_ipn", inpPayment)
router.get("/", getAllPayments)
router.get("/:id", getPayment);
router.delete("/:id", deletePayment);
router.put("/:id", updatePayment);


module.exports = router;
