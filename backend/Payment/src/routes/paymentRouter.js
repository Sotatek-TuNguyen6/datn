const express = require("express");
const { createPayment, getPayment, getAllPayments, updatePayment, deletePayment } = require("../controller/paymentController");
const router = express.Router();

router.post("/", createPayment);
router.get("/", getAllPayments)
router.get("/:id", getPayment);
router.delete("/:id", deletePayment);
router.put("/:id", updatePayment);

module.exports = router;
