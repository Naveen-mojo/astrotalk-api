const mongoose = require('mongoose');

const Zodiac = mongoose.model(
    'Zodiac',
    new mongoose.Schema({
        id: {
            type: Number,
            primaryKey: true,
            autoIncrement: true
        },
        zodiacSign: {
            type: String
        },
        startMonth: {
            type: String
        },
        endMonth: {
            type: String
        },
        signSlug: {
            type: String
        },
        zodiacImage: {
            type: String
        }
    }, { timestamps: true })
)


module.exports = Zodiac;