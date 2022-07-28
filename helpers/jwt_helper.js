const jwt = require("jsonwebtoken");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        user: userId,
      };
      const options = {
        expiresIn: "1y",
        issuer: process.env.WEBSITE_URL,
      };
      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        options,
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });
  },
  signRefereshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "1y",
        issuer: process.env.WEBSITE_URL,
      };
      jwt.sign(
        payload,
        process.env.REFERESH_TOKEN_SECRET,
        options,
        (err, token) => {
          if (err) {
            console.log(err.message);
            reject(err);
          }
          resolve(token);
        }
      );
    });
  },
  verifyRefereshToken: (refereshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refereshToken,
        process.env.REFERESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            reject(
              res.json({ status: "failed", message: "Unauthorized Access" })
            );
          }
          const userId = payload.user;

          resolve(userId);
        }
      );
    });
  },
};
