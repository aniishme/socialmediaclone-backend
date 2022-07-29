const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserInfo = require("../../models/UserInfo");
const Post = require("../../models/Post");

router.get(
  "/:userId",

  async (req, res) => {
    const { userId } = req.params;

    let userView = {};

    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ status: "failed", message: "DoesnotExist" });
        }
        userView = { ...userView, id: user._id, name: user.fullname };
        UserInfo.findOne({ userId: userId }).then((userInf) => {
          if (!userInf) {
            return res
              .status(400)
              .json({ status: "failed", message: "Not Found" });
          }

          userView = {
            ...userView,
            info: {
              address: userInf.address,
              gender: userInf.gender,
              bio: userInf.bio,
              followers: userInf.followers,
              following: userInf.following,
            },
          };
          Post.find({ userId: userId }).then((post) => {
            if (!userInf) {
              return res.json({ userView });
            }

            userView = { ...userView, post };
            return res.json(userView);
          });
        });
      })
      .catch((err) => {
        res.status(400).json({ err });
      });
  }
);

router.post(
  "/userinfo",
  require("../../middlewares/jwtAuthorization"),
  async (req, res) => {
    try {
      const userId = await req.payload.user;
      const { address, gender, bio } = await req.body;

      User.findOne({ id: userId })
        .then((user) => {
          if (!user) {
            return res
              .status(400)
              .json({ status: "failed", message: "Unauthorized" });
          }

          UserInfo.findOne({ userId: userId })
            .then((usrInf) => {
              if (usrInf) {
                return res
                  .status(422)
                  .json({ status: "failed", message: "Already Exists" });
              }
              const newUserInfo = new UserInfo({
                address,
                gender,
                bio,
                userId,
              });
              newUserInfo
                .save()
                .then(() => {
                  return res
                    .status(200)
                    .json({ status: "success", message: "User Info Updated" });
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
