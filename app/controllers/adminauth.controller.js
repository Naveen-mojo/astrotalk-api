const config = require("../config/auth.config");
const db = require('../models');
const { adminuser: AdminUser, adminRefreshToken: AdminRefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.addAdminUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: "Please Fill Required Filled Like Email and Password." })
        return;
    }

    const user = new AdminUser({
        email: req.body.email,
        name: req.body.name,
        status: req.body.status,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "User was registered successfully!" });
    });
};

exports.AdminSignin = (req, res) => {
    AdminUser.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec(async (err, admin) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!admin) {
                return res.status(404).send({ message: "Email or Passwrod does not match." });
            }

            if (!req.body.password) {
                return res.status(404).send({ message: "Please Enter Your Password." });
            }

            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                admin.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }

            let token = jwt.sign(
                {
                    id: admin.id,
                    email: admin.email,
                    status: admin.status,
                },
                config.secret,
                {
                    expiresIn: config.jwtExpiration,
                }
            );

            let refreshToken = await AdminRefreshToken.createToken(admin);

            res.status(200).send({
                id: admin._id,
                email: admin.email,
                access: token,
                refresh: refreshToken,
                message: "Login Successfully!",
            });
        });
};

exports.AdminAuthRefreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await AdminRefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (AdminRefreshToken.verifyExpiration(refreshToken)) {
            AdminRefreshToken.findByIdAndRemove(refreshToken._id, {
                useFindAndModify: false,
            }).exec();

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        AdminUser.findById(refreshToken.admin._id)
            .populate("roles", "-__v")
            .exec((err, admin) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                let newAccessToken = jwt.sign(
                    {
                        id: refreshToken.admin._id,
                        email: admin.email,
                        status: admin.status,
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