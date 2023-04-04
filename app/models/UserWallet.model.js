const mongoose = require('mongoose');

const UserWallet = mongoose.model(
    'UserWallet',
    new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        wallet: [
            {
                amount: Number,
                subTotal: Number,
                action: Boolean,
                walletUpdated_at: Date,
                particular: String,
            }
        ],

        total: Number,

    }, { timestamps: true })
)

module.exports = UserWallet;

// total = 50
// wallet = [
//     {
//         amount: 20,
//         action: true,
//         subTotal: 70,
//     },
//     {
//         amount: 10,
//         action: false,
//         subTotal: 60,
//     }
// ]