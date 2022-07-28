const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserInfo = require("../../models/UserInfo");

router.get(
  "/:userId",
  require("../../middlewares/jwtAuthorization"),
  (req, res) => {
    res.send(req.params.userId);
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
