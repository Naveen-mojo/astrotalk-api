const mongoose = require('mongoose');

const PaymentHistory = mongoose.model(
    'PaymentHistory',
    new mongoose.Schema({
        id: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        amount: {
            type: Number
        },
        amount_received: {
            type: Number
        },
        created: {
            type: Number
        },
        currency: {
            type: String,
        },
        payment_method: {
            type: String
        },
        payment_method_types: {
            type: Array
        },
        status: {
            type: String
        }
    }, { timestamps: true })
)

module.exports = PaymentHistory;