const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const User = require("../../models/User");

router.post(
  "/create-post",
  require("../../middlewares/jwtAuthorization"),
  async (req, res) => {
    const { content, userId, username } = await req.body;
    await User.findOne({ id: userId }).then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ status: "failed", message: "Unauthorized" });
      }

      const newPost = new Post({
        content,
        userId,
        username,
      });
      newPost
        .save()
        .then(() => {
          return res
            .status(201)
            .json({ status: "success", message: "Post Created" });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ status: "failed", message: "Post Creation Failed", err });
        });
    });
  }
);

router.get(
  "/",
  require("../../middlewares/jwtAuthorization"),
  async (req, res) => {
    await Post.find({}).then((post) => {
      return res.json(post);
    });
  }
);
module.exports = router;
