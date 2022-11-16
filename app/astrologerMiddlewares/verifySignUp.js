const db = require("../models");
const ROLES = db.ROLES;
const Astro = db.astro;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Number
  Astro.findOne({
    number: req.body.number
  }).exec((err, astro) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (astro) {
      res.status(400).send({ message: "Failed! Number is already in use!" });
      return;
    }

    // Email
    Astro.findOne({
      email: req.body.email
    }).exec((err, astro) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (astro) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
