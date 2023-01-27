const mongoose = require('mongoose');

const Horoscope = mongoose.model(
    'Horoscope',
    new mongoose.Schema({
        id: {
            type: Number,
            primaryKey: true,
            autoIncrement: true
        },
        horoscope: {
            type: String
        },
        horoSlug: {
            type: String
        }
    }, { timestamps: true })
)


module.exports = Horoscope;