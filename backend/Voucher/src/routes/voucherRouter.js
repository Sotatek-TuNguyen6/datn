const express = require('express');
const router = express.Router();
const voucherController = require('../controller/voucherController'); // Adjust the path as needed
const { protect } = require('../middleware/AuthMiddleware');

router.get('/', voucherController.getAllVouchers);

router.get('/:id', voucherController.createVoucher);

router.post('/', voucherController.createVoucher);
router.post('/useVoucher', protect, voucherController.useVoucher);

router.put('/:id', voucherController.updateVoucherById);

router.delete('/:id', voucherController.deleteVoucherById);

module.exports = router;
