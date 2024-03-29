const mongoose = require("mongoose");

const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        conversationId: {
            type: String
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
    }, { timestamps: true })
);

module.exports = Message;
