const { authJwt } = require("../middlewares");
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/user.controller");
const conversationController = require("../controllers/conversation.controller");
const messageController = require("../controllers/message.controller");
const astroController = require("../controllers/astro.controller");
const paymentController = require("../controllers/stripe");
// const signUpController = require('../astrologerController/signup.controller');
const addmoneywallet = require('../controllers/addmoney.controller');
const videocallController = require('../controllers/videocall.controller');

const horoscopeController = require('../controllers/horoscope.controller')
const horoscopeContentController = require('../controllers/horoscopeContent.controller')
const zodiacController = require('../controllers/zodiac.controller')
const zodiacCompatibilityController = require('../controllers/zodiacCompatibility.controller')
const chatController = require('../controllers/chat.controller')
const stripeController = require('../controllers/stripe')


const Stripe = require("stripe");
const stripe = Stripe("sk_test_51LpoOQSCkptFWpk2yUOUAKc1UDTdwZ6SzleVz9TG7BnQWbEr4sOpNdZweiF0Ba16GLhugR9Zs8pLzo7P39fjq24p00IfBRUdn1")


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

  // payments gateways
  app.post('/api/create-checkout-session', paymentController.stripePayment)

  app.post('/webhook', paymentController.webhooks)

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

  app.post('/pay', stripeController.stripePaymentNew)


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

  // confirm the paymentIntent
  app.post('/pay', async (request, response) => {
    try {
      // Create the PaymentIntent
      let intent = await stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        description: "Test payment",
        amount: request.body.amount * 100,
        currency: 'inr',
        confirmation_method: 'manual',
        confirm: true,
        payment_method_types: [
          "card"
        ],
      });
      // Send the response to the client
      response.send(generateResponse(intent));

      const newChat = new Chat({
        userId: req.body.userId,
        astrologerId: req.body.astrologerId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });

      try {
        const savedChat = await newChat.save();
        res.status(200).json(savedChat);
      } catch (err) {
        res.status(500).json(err);
      }

    } catch (e) {
      // Display error on client
      return response.send({ error: e.message });
    }
  });

  const generateResponse = (intent) => {
    if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      };
    }
  };

};

