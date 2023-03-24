const db = require('../models');
const { conversation: Conversation } = db;

// Add Conversation
exports.addConversation = async (req, res) => {
    if (!req.body.senderId || !req.body.receiverId) {
        res.status(400).send({ message: "please fill all required fields" })
        return;
    }
    const newConversation = new Conversation({
        members: [req.body.receiverId, req.body.senderId],
    });

    const conversationFind = await Conversation.findOne({
        members: [req.body.receiverId, req.body.senderId],
    });

    try {

        if (conversationFind !== null) {
            console.log("Null not find")
            res.status(200).json({ message: "Update the value" });
        } else {
            console.log("Null Find")
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Conversation 
exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Conversation Include Two user id

exports.getConversationUsers = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};