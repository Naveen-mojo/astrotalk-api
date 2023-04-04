const mongoose = require('mongoose');

const FeedbackForm = mongoose.model("FeedbackForm",
    new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        astroId: {
            type: String,
            required: true
        },
        rating: Number,
        description: String
    }, { timestamps: true })
)

module.exports = FeedbackForm;