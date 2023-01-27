const mongoose = require('mongoose');

const HoroscopeContent = mongoose.model(
    'HoroscopeContent',
    new mongoose.Schema({
        id: {
            type: Number,
            primaryKey: true,
            autoIncrement: true
        },
        zodiacID: {
            type: Number
        },
        horoscopeID: {
            type: Number
        },
        description: {
            type: String
        },
        creationDate: {
            type: Date
        }
    },{ timestamps: false })
)


module.exports = HoroscopeContent;