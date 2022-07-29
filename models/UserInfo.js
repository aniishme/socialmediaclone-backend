const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  bio: {
    type: String,
  },
  followers: [String],
  following: [String],
  userId: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);
module.exports = UserInfo;
