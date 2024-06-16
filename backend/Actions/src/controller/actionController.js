const Action = require("../model/actionModel")

exports.createAction = async (req, res) => {
    const { userId, productId, actionType, rating } = req.body;
    try {
        const existingAction = await Action.findOne({ userId, productId, actionType });

        if (existingAction) {
            return res.status(400).json({ message: 'Action already exists' });
        }

        const newAction = await Action.create({ userId, productId, actionType, rating });
        res.status(201).json(newAction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};