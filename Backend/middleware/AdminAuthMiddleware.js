const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const AdminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No Access Token" });
  }
  JWT.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or imvalid" });
    }
    if (decoded.role === "admin") {
      req.user = decoded;
      next();
    }
    return res.status(403).json({ message: "Access Denied" });
  });
};
module.exports = AdminAuthMiddleware;
