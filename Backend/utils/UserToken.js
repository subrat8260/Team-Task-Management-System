const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Geerate Access Token
exports.generateAccessToken = (user) => {
  return JWT.sign({ id: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: "15m",
  });
};
//Generate Refresh Token
exports.generateRefreshToken = (user) => {
  return JWT.sign({ id: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: "7d",
  });
};
