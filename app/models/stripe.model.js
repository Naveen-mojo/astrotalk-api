const mongoose = require('mongoose');

const Order = mongoose.model(
    'Order',
    new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        customerId: {
            type: String
        },
        paymentIntentId: {
            type: String
        },
        product: [
            {
                id: {
                    type: String
                },
                name: {
                    type: String
                },
                price: {
                    type: String
                },
                cartQuantity: {
                    type: Number
                }
            }
        ],
        subTotal: {
            type: Number
        },
        total: {
            type: Number,
            required: true
        },
        payment_status: {
            type: String,
            required: true
        }
    }, { timestamps: true })
)

module.exports = Order