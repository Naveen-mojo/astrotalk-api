const mongoose = require("mongoose");

const Conversation = mongoose.model(
    "Conversation",
    new mongoose.Schema({
        members: {
            type: Array,
            required:true
        }
    }, { timestamps: true })
);

module.exports = Conversation;
