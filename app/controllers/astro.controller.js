const config = require("../config/auth.config");
const db = require("../models");
const { astro: Astro, astroRefreshToken: AstroRefreshToken, role: Role } = db;

const jwt = require("jsonwebtoken");

exports.addAstro = (req, res) => {
  if (!req.body.astrologerName) {
    res.status(400).send({ message: "please fill all required fields" });
    return;
  }
  const newAstro = new Astro({
    astrologerName: req.body.astrologerName,
    email: req.body.email,
    shortName: req.body.shortName,
    gender: req.body.gender,
    DOB: req.body.DOB,
    primarySkills: JSON.parse(req.body.primarySkills),
    hours: req.body.hours,
    isPlatform: req.body.isPlatform,
    monthlyEarning: req.body.monthlyEarning,
    nameOfPlatform: req.body.nameOfPlatform,
    skill: JSON.parse(req.body.skill),
    description: req.body.description,
    cityName: req.body.cityName,
    onBoard: req.body.onBoard,
    exp: req.body.exp,
    language: JSON.parse(req.body.language),
    chatRate: req.body.chatRate,
    callRate: req.body.callRate,
    contactExt: req.body.contactExt,
    contactNumber: req.body.contactNumber,
    profileImage: `https://astrotalkapi.herokuapp.com/upload/${req.file.filename}`,
    galleryImage: req.body.galleryImage,
    isActive: req.body.isActive,
    isValid: req.body.isValid,
    verifyCode: req.body.verifyCode,
    interviewTime: req.body.interviewTime,
    incomeSource: req.body.incomeSource,
    isLoggedin: req.body.isLoggedin,
    password: req.body.password,
  });
  try {
    const saveAstro = newAstro.save();
    res
      .status(201)
      .send({
        data: newAstro,
        status: 201,
        message: "Data Created Succesfully",
      });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getAstro = async (req, res) => {
  try {
    const astro = await Astro.find({
      isActive: 1,
    }, { password: 0, verifyCode: 0 });
    res.status(200).json(astro);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getByIdAstro = async (req, res) => {
  var astroId = req.params.id;
  try {
    const astro = await Astro.findById({
      _id: astroId,
      isActive: 1,
    },{ password: 0, verifyCode: 0 });
    res.status(200).json(astro);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

exports.Astrologersignin = (req, res) => {
  Astro.findOne({
    email: req.body.email,
    password: req.body.password,
  })
    .populate("roles", "-__v")
    .exec(async (err, astro) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!astro) {
        return res
          .status(404)
          .send({ message: "Email or Passwrod does not match" });
      }

      let token = jwt.sign(
        {
          id: astro.id,
          username: astro.astrologerName,
          number: astro.contactNumber,
        },
        config.secret,
        {
          expiresIn: config.jwtExpiration,
        }
      );

      let refreshToken = await AstroRefreshToken.createToken(astro);

      res.status(200).send({
        id: astro._id,
        username: astro.username,
        number: astro.number,
        access: token,
        refresh: refreshToken,
        message: "Login Successfully!",
      });
    });
};

exports.AstrologerrefreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await AstroRefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (AstroRefreshToken.verifyExpiration(refreshToken)) {
      AstroRefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    Astro.findById(refreshToken.astro._id)
      .populate("roles", "-__v")
      .exec((err, astro) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        let newAccessToken = jwt.sign(
          {
            id: refreshToken.astro._id,
            username: astro.astrologerName,
            number: astro.contactNumber,
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
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

exports.updateAstroProfile = async (req, res) => {
  try {
    const _id = req.params.id;
    if (!req.body) {
      res.status(400).send({ message: "No changes to update." });
      return;
    }
    const data = {
      astrologerName: req.body.astrologerName,
      email: req.body.email,
      shortName: req.body.shortName,
      gender: req.body.gender,
      DOB: req.body.DOB,
      primarySkills: JSON.parse(req.body.primarySkills),
      hours: req.body.hours,
      isPlatform: req.body.isPlatform,
      monthlyEarning: req.body.monthlyEarning,
      nameOfPlatform: req.body.nameOfPlatform,
      skill: JSON.parse(req.body.skill),
      description: req.body.description,
      cityName: req.body.cityName,
      onBoard: req.body.onBoard,
      exp: req.body.exp,
      language: JSON.parse(req.body.language),
      chatRate: req.body.chatRate,
      callRate: req.body.callRate,
      contactExt: req.body.contactExt,
      contactNumber: req.body.contactNumber,
      profileImage: req.file ? `http://localhost:8080/upload/${req.file.filename}` : 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
      galleryImage: req.body.galleryImage,
      isActive: req.body.isActive,
      interviewTime: req.body.interviewTime,
      incomeSource: req.body.incomeSource,
      isLoggedin: req.body.isLoggedin,
      password: req.body.password,

    }
    const astro = await Astro.findByIdAndUpdate(_id, data, {
      useFindAndModify: false,
      new: true,
    });

    if (!astro) {
      res
        .status(400)
        .send({
          message: `Cannot update Data with id=${_id}. Maybe Data was not found!`,
        });
    }
    res.status(200).send({ message: "Data Updated Successfully!", data: astro });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
