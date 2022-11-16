const mongoose = require('mongoose');

const Wallet = mongoose.model(
    'Addwallet',
    new mongoose.Schema({
        amount: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        active: {
            type: Number,
            default: 1
        }
    }, { timestamps: true })
)

module.exports = Wallet;
