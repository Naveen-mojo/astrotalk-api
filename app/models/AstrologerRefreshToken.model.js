const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  astro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Astro",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (astro) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.jwtRefreshExpiration
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    astro: astro._id,
    expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const AstrologerRefreshToken = mongoose.model("AstrologerRefreshToken", RefreshTokenSchema);

module.exports = AstrologerRefreshToken;
