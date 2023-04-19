const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const moment = require('moment')

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    number: req.body.number,
    firstname: req.body.firstname,
    email: req.body.email,
    OTPVerification: req.body.OTPVerification,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signinFirstStep = (req, res) => {
  User.findOne({
    number: req.body.number,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Number Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      res.status(200).send({
        message: "Number Verify Successfully!",
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    number: req.body.number,
    OTPVerification: req.body.OTPVerification,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "OTP does not match" });
      }

      let token = jwt.sign(
        {
          id: user.id,
          firstname: user.firstname,
          number: user.number,
        },
        config.secret,
        {
          expiresIn: config.jwtExpiration,
        }
      );

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        firstname: user.firstname,
        number: user.number,
        roles: authorities,
        access: token,
        refresh: refreshToken,
        message: "Login Successfully!",
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    User.findById(refreshToken.user._id)
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        let newAccessToken = jwt.sign(
          {
            id: refreshToken.user._id,
            firstname: user.firstname,
            number: user.number,
          },
          config.secret,
          {
            expiresIn: config.jwtExpiration,
          }
        );

        return res.status(200).json({
          access: newAccessToken,
          refresh: refreshToken.token,
        });
      });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

//get a user
exports.getUserById = async (req, res) => {
  const userId = req.query.userId;
  const firstname = req.query.firstname;
  try {
    if (req.query.userId || req.query.firstname) {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ firstname: firstname });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } else {
      const user = await User.find({}, { password: 0 });
      res.status(200).json(user);
    }

  } catch (err) {
    res.status(500).json(err);
  }
};

//update user
exports.updateUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const data = await User.updateOne({ _id }, {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        datebirth: moment(req.body.datebirth).format("YYYY-MM-DD"),
        timebirth: req.body.timebirth,
        placebirth: req.body.placebirth,
        currentaddress: req.body.currentaddress,
        city: req.body.city,
        pincode: req.body.pincode,
      }
    }, {
      new: true
    }
    );
    res.status(200).send({ message: "Data Updated Successfully!", data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};