const { authJwt } = require("../middlewares");
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/user.controller");
const conversationController = require("../controllers/conversation.controller");
const messageController = require("../controllers/message.controller");
const astroController = require("../controllers/astro.controller");
const paymentController = require("../controllers/stripe");
// const signUpController = require('../astrologerController/signup.controller');
const addmoneywallet  = require('../controllers/addmoney.controller');


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

  // payments gateways
  app.post('/create-checkout-session', paymentController.stripePayment)

  app.post('/webhook', paymentController.webhooks)


  // Astrologer SignUp

  // app.post('/api/astrologer/create', signUpController.AstroSignUp)


  // AddMoneyWallet

  app.post('/api/addmoneywallet', addmoneywallet.addMoneyWallet)

  app.get('/api/walletmoney', addmoneywallet.getWalletMoney)



  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

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