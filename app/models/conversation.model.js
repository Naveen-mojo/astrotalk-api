const mongoose = require("mongoose");

const Conversation = mongoose.model(
    "Conversation",
    new mongoose.Schema({
        // members: {
        //     type: Array,
        //     required: true,
        //     unique: true
        // }
        astroId: String,
        userId: String,
        message: [{
            text: String,
            sender: String,
            chattime: Date
        }]
    }, { timestamps: true })
);

module.exports = Conversation;









// const mongoose = require("mongoose");

// const Conversation = mongoose.model(
//     "Conversation",
//     new mongoose.Schema({
//         members: {
//             type: Array,
//             required: true,
//             unique: true
//         }
//     }, { timestamps: true })
// );

// module.exports = Conversation;
