const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    number: String,
    firstname: String,
    email: String,
    OTPVerification: String,
    password: String,
    lastname: String,
    datebirth: String,
    timebirth: String,
    placebirth: String,
    currentaddress: String,
    city: String,
    pincode: Number,
    is_verified: Boolean,
    status: Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
