const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);
module.exports = UserInfo;
