const VoucherModel = require('../model/voucherModels');

// Create a new voucher
exports.createVoucher = async (req, res) => {
    try {
        const voucher = new VoucherModel(req.body);
        await voucher.save();
        res.status(201).send(voucher);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all vouchers
exports.getAllVouchers = async (req, res) => {
    try {
        const vouchers = await VoucherModel.find({});
        res.status(200).send(vouchers);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a voucher by ID
exports.getVoucherById = async (req, res) => {
    try {
        const voucher = await VoucherModel.findById(req.params.id);
        if (!voucher) {
            return res.status(404).send();
        }
        res.status(200).send(voucher);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a voucher by ID
exports.updateVoucherById = async (req, res) => {
    try {
        const voucher = await VoucherModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!voucher) {
            return res.status(404).send();
        }
        res.status(200).send(voucher);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a voucher by ID
exports.deleteVoucherById = async (req, res) => {
    try {
        const voucher = await VoucherModel.findByIdAndDelete(req.params.id);
        if (!voucher) {
            return res.status(404).send();
        }
        res.status(200).send(voucher);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.useVoucher = async (req, res) => {
    try {
        const voucher = await VoucherModel.findOne({ code: req.body.code });

        if (!voucher) {
            return res.status(404).send({ error: 'Voucher not found' });
        }

        if (voucher.expirationDate < new Date()) {
            return res.status(400).send({ error: 'Voucher has expired' });
        }

        if (!voucher.isActive) {
            return res.status(400).send({ error: 'Voucher is not active' });
        }

        if (voucher.usageCount >= voucher.maxUsage) {
            return res.status(400).send({ error: 'Voucher usage limit reached' });
        }

        if (voucher.usedBy.includes(req.user.id)) {
            return res.status(400).send({ error: 'User has already used this voucher' });
        }

        voucher.usedBy.push(req.user.id);
        voucher.usageCount += 1;

        await voucher.save();
        res.status(200).send({ discount: voucher.discount });
    } catch (error) {
        res.status(500).send(error);
    }
};