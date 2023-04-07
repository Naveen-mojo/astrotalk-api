const mongoose = require('mongoose');

const Astro = mongoose.model(
    'Astro',
    new mongoose.Schema({
        astrologerName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true
        },
        shortName: {
            type: String,
        },
        gender: {
            type: String
        },
        DOB: {
            type: String
        },
        primarySkills: {
            type: Array
        },
        hours: {
            type: Number
        },
        isPlatform: {
            type: String
        },
        monthlyEarning: {
            type: String
        },
        nameOfPlatform: {
            type: String
        },
        skill: {
            type: Array
        },
        description: {
            type: String
        },
        cityName: {
            type: String
        },
        onBoard: {
            type: String
        },
        exp: {
            type: Number
        },
        language: {
            type: Array
        },
        chatRate: {
            type: Number
        },
        callRate: {
            type: Number
        },
        contactExt: {
            type: String
        },
        contactNumber: {
            type: String
        },
        profileImage: {
            type: String
        },
        galleryImage: {
            type: Array
        },
        isActive: {
            type: Number
        },
        status: {
            type: Number
        },
        verifyCode: {
            type: String
        },
        interviewTime: {
            type: String
        },
        incomeSource: {
            type: String
        },
        wallet: {
            type: Number
        },
        walletHistroy: {
            type: Array
        },
        isLoggedIn: {
            type: Number
        },
        termConditions: {
            type: String
        },
        password: {
            type: String
        }
    }, { timestamps: true })
)

module.exports = Astro;