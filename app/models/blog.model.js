const mongoose = require("mongoose");

const Blog = mongoose.model("Blog",
    new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        images: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        author: {
            type: String
        }
    }, { timestamps: true })
)

module.exports = Blog;