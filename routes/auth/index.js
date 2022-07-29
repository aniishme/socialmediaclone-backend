const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");

const {
  signAccessToken,
  signRefereshToken,
  verifyRefereshToken,
} = require("../../helpers/jwt_helper");
const UserInfo = require("../../models/UserInfo");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email or Password is incorrect" });
    } else
      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          const accessToken = await signAccessToken(user._id);
          const refereshToken = await signRefereshToken(user._id);
          return res.status(200).json({
            token: {
              accessToken: accessToken,
              refereshToken: refereshToken,
            },
            acc: {
              id: user._id,
              name: user.fullname,
              email: user.email,
              joined: user.date_created,
            },
          });
        } else {
          return res.status(500).json({
            message: "Email or Password is incorrect.",
          });
        }
      });
  });
});

router.post(
  "/register",
  body("fullname").trim().notEmpty(),
  body("email").trim().isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = await req.body;

    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ status: "failed", message: "User already exists..." });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "failed", message: "Something Went wrong" });
          }

          const user = new User({
            fullname,
            email,
            password: hashedPassword,
          });

          user
            .save()
            .then(() => {
              const userInfo = new UserInfo({
                userId: user.id,
              });
              userInfo.save().then(() => {
                return res.status(200).json({
                  status: "success",
                  message: "User created successfully",
                });
              });
            })
            .catch((err) => console.log(err));
        });
      }
    });
  }
);

router.post("/referesh-token", async (req, res) => {
  try {
    const { refereshToken } = req.body;
    if (!refereshToken) {
      return res.json({ status: "failed" });
    }
    const userId = await verifyRefereshToken(refereshToken);

    const accessToken = await signAccessToken(userId);
    const newRefereshToken = await signRefereshToken(userId);
    return res.status(200).json({
      accessToken: "Bearer " + accessToken,
      refereshToken: newRefereshToken,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
