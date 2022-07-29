require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { application } = require("express");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/posts", require("./routes/posts"));
app.get("/", require("./middlewares/jwtAuthorization"), (req, res) => {
  res.send({ msg: "Hello, You are authorized!!", user: req.payload });
});
function start() {
  try {
    mongoose.connect(process.env.REMOTE_MONGO_URI).then(() => {
      console.log("connected to database");
      app.listen(process.env.PORT, () => {
        console.log("Server started at https://localhost:8000");
      });
    });
  } catch (error) {
    throw error;
  }
}
start();
