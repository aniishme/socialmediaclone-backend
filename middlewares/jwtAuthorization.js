const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ status: "failed", message: "Access denied" });
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Access Denied" : err.message;
      return res.status(401).json({ status: "failed", message: message });
    }
    req.payload = payload;
    next();
  });
};

module.exports = verifyAuth;
