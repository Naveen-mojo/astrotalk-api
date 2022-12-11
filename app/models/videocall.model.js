const mongoose = require('mongoose');

const VideoCall = mongoose.model(
    'VideoCall',
    new mongoose.Schema({
        roomId: {
            type: String
        },
        astroId: {
            type: String,
            required: true
        },
        userID: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: false
        },
        status: {
            type: Number,
            default: 0
        }
    }, { timestamps: true })
)

module.exports = VideoCall;