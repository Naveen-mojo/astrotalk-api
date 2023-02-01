const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.conversation = require("./conversation.model");
db.message = require("./message.model");
db.kundli = require('./kundli.model');
db.astro = require('./astro.model');
db.astroRefreshToken = require('./AstrologerRefreshToken.model');
db.addwallet = require('./addMoneyWallet.model')
db.videocall = require('./videocall.model')

db.horoscope = require('./horoscope.model')
db.horoscopecontent = require('./horoscopecontent.model')
db.zodiac = require('./zodiac.model')
db.zodiacCompatibility = require('./zodiacCompatibility.model')
db.chat = require('./chat.model')

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;