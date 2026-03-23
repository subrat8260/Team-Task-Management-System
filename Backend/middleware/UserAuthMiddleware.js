const UserAuthMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === "user") {
      next();
    }
    return res.status(403).json({ message: "Access Denied !" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = UserAuthMiddleware;
