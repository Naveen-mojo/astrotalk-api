const mongoose = require('mongoose');

const ZodiacCompatibility = mongoose.model(
    'ZodiacCompatibility',
    new mongoose.Schema({
        yourSign: {
            type: String
        },
        partnerSign: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        slug: {
            type: String
        }
    }, { timestamps: true })
)

module.exports = ZodiacCompatibility;