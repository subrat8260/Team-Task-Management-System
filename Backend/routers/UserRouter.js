const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/UserAuthMiddleware");
UserRouter.get("/", AuthMiddleware, (req, res) => {
  res.send("Get all Users");
});
UserRouter.post("/login", UserController.postLogin);
UserRouter.post("/signup", UserController.postSignup);
UserRouter.post("/logout", AuthMiddleware, UserController.postLogout);
UserRouter.post("/refresh", UserController.refreshToken);

module.exports = UserRouter;
