const db = require('../models');
const { chat: Chat } = db;

// Add Chat
exports.addChat = async (req, res) => {
    const newChat = new Chat({
        userId: req.body.userId,
        astrologerId: req.body.astrologerId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    });

    try {
        const savedChat = await newChat.save();
        res.status(200).json(savedChat);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Add Chat
exports.updateChat = async (req, res) => {
    const updateChatTime = new Chat({
        startTime: req.body.startTime,
        endTime: req.body.endTime
    });

    try {
        const updateChat = await updateChatTime.save();
        res.status(200).json(updateChat);
    } catch (err) {
        res.status(500).json(err);
    }
};

