const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No Access Token" });
    }
    JWT.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired or invalid" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = AuthMiddleware;
