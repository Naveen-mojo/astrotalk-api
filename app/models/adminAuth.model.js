const mongoose = require('mongoose')

const adminUser = mongoose.model("adminUser",
    new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            max: 100
        },
        status: {
            type: Boolean,
            default: true
        }
    }, { timestamps: true })
)

module.exports = adminUser;