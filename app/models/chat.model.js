const mongoose = require('mongoose');

const Chat = mongoose.model(
    'Chat',
    new mongoose.Schema({
        userId: {
            type: String
        },
        astrologerId: {
            type: String
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        },
    })
)

module.exports = Chat;