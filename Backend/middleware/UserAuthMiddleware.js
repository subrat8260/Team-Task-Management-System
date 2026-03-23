const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const UserAuthMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "No Access Token" });
  }
  await JWT.verify(accessToken, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid" });
    }
    if (decoded.role === "user") {
      req.user = decoded;
      next();
    }
    return res.status(403).json({ message: "Access Denied !" });
  });
};
module.exports = UserAuthMiddleware;
