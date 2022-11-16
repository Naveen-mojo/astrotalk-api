const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    number: String,
    username: String,
    email: String,
    OTPVerification: String,
    password: String,
    wallet: Number,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
