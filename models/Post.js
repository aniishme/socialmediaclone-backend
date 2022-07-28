const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: [
    {
      key: String,
      text: String,
    },
  ],
  userId: {
    type: String,
    required: true,
  },
  likedBy: [String],
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
