const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/UserController");
UserRouter.get("/", (req, res) => {
  res.send("Get all Users");
});
UserRouter.post("/login", UserController.postLogin);
UserRouter.post("/signup", UserController.postSignup);
UserRouter.post("/logout", UserController.postLogout);
UserRouter.post("/refresh", UserController.refreshToken);

module.exports = UserRouter;
