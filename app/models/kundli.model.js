const mongoose = require('mongoose');

const Kundli = mongoose.model(
    "Kundli",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        gender: {
            type: String
        }
    }, { timestamps: true })
)

module.exports = Kundli;