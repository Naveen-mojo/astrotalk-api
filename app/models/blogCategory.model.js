const mongoose = require("mongoose");

const BlogCategory = mongoose.model("BlogCategory",
    new mongoose.Schema({
        category: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
    }, { timestamps: true })
)

module.exports = BlogCategory;