const { verifySignUp } = require("../middlewares");
// const { AstroverifySignUp } = require("../astrologerMiddlewares");
const controller = require("../controllers/auth.controller");
const astroController = require("../controllers/astro.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/astro/signin", astroController.Astrologersignin);

  app.post(
    "/api/auth/astro/refreshtoken",
    astroController.AstrologerrefreshToken
  );

  app.post("/api/auth/signin", controller.signin);

  app.get("/api/auth/user", controller.getUserById);

  app.post("/api/auth/signinfirststep", controller.signinFirstStep);

  app.post("/api/auth/refreshtoken", controller.refreshToken);

  app.patch("/api/auth/update/:id", controller.updateUser);
};
