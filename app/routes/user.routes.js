const { authJwt } = require("../middlewares");
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/user.controller");
const conversationController = require("../controllers/conversation.controller");
const messageController = require("../controllers/message.controller");
const astroController = require("../controllers/astro.controller");
const addmoneywallet = require('../controllers/addmoney.controller');
const videocallController = require('../controllers/videocall.controller');

const horoscopeController = require('../controllers/horoscope.controller')
const horoscopeContentController = require('../controllers/horoscopeContent.controller')
const zodiacController = require('../controllers/zodiac.controller')
const zodiacCompatibilityController = require('../controllers/zodiacCompatibility.controller')
const chatController = require('../controllers/chat.controller')
const stripeController = require('../controllers/stripe')
const userWalletController = require('../controllers/userwallet.controller')
const feedbackFormController = require('../controllers/FeedbackForm.controller')


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../upload'),
    filename: function (req, file, cb) {
      // null as first argument means no error
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  let upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });


  app.get("/api/test/all", controller.allAccess);

  // Conversation Api
  app.post("/api/conversation/add", conversationController.addConversation);

  app.get("/api/conversation/:userId", conversationController.getConversation);

  app.get("/api/conversation/find/:firstUserId/:secondUserId", conversationController.getConversationUsers);

  // Message Api

  app.post("/api/message/add", messageController.addMessage);

  app.get("/api/message/:conversationId", messageController.getMessage);

  // Astro Api

  app.post("/api/astro/add", upload.single('profileImage'), astroController.addAstro);

  app.get("/api/astro", astroController.getAstro);

  app.get("/api/astro/user/:id", astroController.getByIdAstro);

  app.patch("/api/astro/update/:id", upload.single('profileImage'), astroController.updateAstroProfile);

  app.patch("/api/astro/update/status/:id", astroController.updateStatus);

  app.get("/api/astro/search", astroController.getAstroSearch);

  // Video Call Api

  app.post('/api/videocall/add', videocallController.addVideoCall);

  app.get('/api/videocall/all', videocallController.getVideoCall);

  app.patch('/api/videocall/update/:id', videocallController.updateVideoCall);


  // Astrologer SignUp

  // app.post('/api/astrologer/create', signUpController.AstroSignUp)


  // AddMoneyWallet

  app.post('/api/addmoneywallet', addmoneywallet.addMoneyWallet)

  app.get('/api/walletmoney', addmoneywallet.getWalletMoney)


  // Horoscope Api
  app.post('/horoscope/add', horoscopeController.addHoroscope)
  app.post('/horoscope/content/add', horoscopeContentController.addHoroscopeContent)
  app.post('/zodiac/add', zodiacController.addZodiac)
  app.get('/api/zodiac/all', zodiacController.getZodiac)
  app.post('/zodiacCompatibility/add', zodiacCompatibilityController.addZodiacCompatibility)


  // chat Api

  app.post('/api/chat/add', chatController.addChat)
  app.patch('/api/chat/update', chatController.updateChat)


  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.post('/pay', stripeController.stripePaymentNew);
  app.get('/api/payhistory/:id', stripeController.paymentHistroy);


  // userwallet Api 

  app.post('/api/userwallet/:id', userWalletController.addUserWallet)
  app.get('/api/wallet/all/:id', userWalletController.getWallet)

  // FeedbackForm Api

  app.post('/api/feedbackform/add', feedbackFormController.addFeedbackForm)
  app.get('/api/feedbackform', feedbackFormController.getFeedbackForm)
  // app.get('/api/feedbackform', feedbackFormController.findCommentPagination)


  // Zodaic Compability

  app.get('/api/zodiacpair/id/:selfId/partner/:partnerId', zodiacCompatibilityController.getZodiacPair);
  app.get('/api/horoscope/:type/:zodiac', horoscopeController.getHoroscope)
  app.get('/api/horoscope/category', horoscopeController.getCategory)

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

