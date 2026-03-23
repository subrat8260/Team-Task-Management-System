const express = require("express");
const TeamRouter = express.Router();
const TeamController = require("../controllers/TeamController");
const UserAuthMiddleware = require("../middleware/UserAuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");
const AuthMiddleware = requireF("../middleware/AuthMiddleware");
//Create a new team
TeamRouter.post(
  "/teams",
  AuthMiddleware,
  AdminAuthMiddleware,
  TeamController.postTeam,
);

//Get all teams
TeamRouter.get(
  "/teams",
  AuthMiddleware,
  AdminAuthMiddleware,
  TeamController.getTeams,
);

//add user to team
TeamRouter.post(
  "/teams/:id/add-user",
  AuthMiddleware,
  AdminAuthMiddleware,
  TeamController.postAddUser,
);

module.exports = TeamRouter;
