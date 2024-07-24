const Action = require("../model/actionModel")
const { publishToQueue } = require('../utils/amqp');

/**
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.createAction = async (req, res) => {
    const { userId, productId, actionType, rating } = req.body;
    try {
        const existingAction = await Action.findOne({ userId, productId, actionType });

        if (existingAction) {
            return res.status(400).json({ message: 'Action already exists' });
        }

        const newAction = await Action.create({ userId, productId, actionType, rating });

        const allActions = await Action.find();

        await publishToQueue('recommend_queue_actions', allActions);

        res.status(201).json(newAction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const userIds = [
    '66946520e4f20286b4c09dec', '6694656de4f20286b4c09df2', '669465a9e4f20286b4c09df9',
    '66946520e4f20286b4c09dec', '669465eae4f20286b4c09e00', '66946627e4f20286b4c09e06',
    '669465eae4f20286b4c09e00'
];

const productIds = [
    { _id: '6671aa76abcdcba57f9fe549' }, { _id: '6671aa76abcdcba57f9fe54a' }, { _id: '6671aa76abcdcba57f9fe54b' },
    { _id: '6671aa76abcdcba57f9fe54c' }, { _id: '6671aa76abcdcba57f9fe54d' }, { _id: '6671aa76abcdcba57f9fe54e' },
    { _id: '6671aa76abcdcba57f9fe54f' }, { _id: '6671aa76abcdcba57f9fe550' }, { _id: '6671aa76abcdcba57f9fe551' },
    { _id: '6671aa76abcdcba57f9fe552' }, { _id: '6671aa76abcdcba57f9fe553' }, { _id: '6671aa76abcdcba57f9fe554' },
    { _id: '6671aa76abcdcba57f9fe555' }, { _id: '6671aa76abcdcba57f9fe556' }, { _id: '6671aa76abcdcba57f9fe557' },
    { _id: '6671aa76abcdcba57f9fe558' }, { _id: '6671aa76abcdcba57f9fe559' }, { _id: '6671aa76abcdcba57f9fe55a' },
    { _id: '6671aa76abcdcba57f9fe55b' }, { _id: '6671aa76abcdcba57f9fe55c' }, { _id: '6671aa76abcdcba57f9fe55d' },
    { _id: '6671aa76abcdcba57f9fe55e' }, { _id: '6671aa76abcdcba57f9fe55f' }, { _id: '6671aa76abcdcba57f9fe560' },
    { _id: '6671acddabcdcba57f9fe58a' }, { _id: '6671acddabcdcba57f9fe58b' }, { _id: '6671acddabcdcba57f9fe58c' },
    { _id: '6671acddabcdcba57f9fe58d' }, { _id: '6671acddabcdcba57f9fe58e' }, { _id: '6671acddabcdcba57f9fe58f' },
    { _id: '6671acddabcdcba57f9fe590' }, { _id: '6671acddabcdcba57f9fe591' }, { _id: '6671acddabcdcba57f9fe592' },
    { _id: '6671acddabcdcba57f9fe593' }, { _id: '6671acddabcdcba57f9fe594' }, { _id: '6671ad4babcdcba57f9fe596' },
    { _id: '6671ad4babcdcba57f9fe597' }, { _id: '6671ad4babcdcba57f9fe598' }, { _id: '6671ad4babcdcba57f9fe599' },
    { _id: '6671ad4babcdcba57f9fe59a' }, { _id: '6671ad4babcdcba57f9fe59b' }, { _id: '6671ad4babcdcba57f9fe59c' },
    { _id: '6671ad4babcdcba57f9fe59d' }, { _id: '6671ad4babcdcba57f9fe59e' }, { _id: '6671ad4babcdcba57f9fe59f' },
    { _id: '6671ad4babcdcba57f9fe5a0' }, { _id: '6671ad4babcdcba57f9fe5a1' }, { _id: '6671ad4babcdcba57f9fe5a2' },
    { _id: '6671ad4babcdcba57f9fe5a3' }, { _id: '6671ad4babcdcba57f9fe5a4' }, { _id: '6671ad4babcdcba57f9fe5a5' },
    { _id: '6671ad4babcdcba57f9fe5a6' }, { _id: '6671ad4babcdcba57f9fe5a7' }, { _id: '6671ad4babcdcba57f9fe5a8' },
    { _id: '6671ad4babcdcba57f9fe5a9' }, { _id: '6671ad4babcdcba57f9fe5aa' }, { _id: '6671ad4babcdcba57f9fe5ab' },
    { _id: '6671ad4babcdcba57f9fe5ac' }, { _id: '6671ad4babcdcba57f9fe5ad' }, { _id: '6671ad4babcdcba57f9fe5ae' },
    { _id: '6671ad4babcdcba57f9fe5af' }, { _id: '6671ad4babcdcba57f9fe5b0' }, { _id: '6671af8dabcdcba57f9fe5bc' },
    { _id: '6671af8dabcdcba57f9fe5bd' }, { _id: '6671af8dabcdcba57f9fe5be' }, { _id: '6671af8dabcdcba57f9fe5bf' },
    { _id: '6671af8dabcdcba57f9fe5c0' }, { _id: '6671af8dabcdcba57f9fe5c1' }, { _id: '6671afe8abcdcba57f9fe5c4' },
    { _id: '6671afe8abcdcba57f9fe5c5' }, { _id: '6671afe8abcdcba57f9fe5c6' }, { _id: '6671afe8abcdcba57f9fe5c7' },
    { _id: '6671afe8abcdcba57f9fe5c8' }, { _id: '6671afe8abcdcba57f9fe5c9' }, { _id: '6671afe8abcdcba57f9fe5ca' },
    { _id: '6671afe8abcdcba57f9fe5cb' }, { _id: '6671afe8abcdcba57f9fe5cc' }, { _id: '6671afe8abcdcba57f9fe5cd' },
    { _id: '6671afe8abcdcba57f9fe5ce' }, { _id: '6671afe8abcdcba57f9fe5cf' }
];

const actionTypes = ['watching', 'add_to_cart', 'purchase'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.genrenterAction = async (req, res) => {
    try {
        const actions = userIds.map(userId => {
            const productId = getRandomElement(productIds)._id;
            const actionType = getRandomElement(actionTypes);
            return { userId, productId, actionType };
        });

        await Action.insertMany(actions);
        res.status(200).send({ message: 'Actions generated successfully', actions });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', error });
    }
};
