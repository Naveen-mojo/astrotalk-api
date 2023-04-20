const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminUser",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (admin) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.jwtRefreshExpiration
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    admin: admin._id,
    expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const AdminRefreshToken = mongoose.model("AdminRefreshToken", RefreshTokenSchema);

module.exports = AdminRefreshToken;
