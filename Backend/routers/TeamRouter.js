const express = require("express");
const TeamRouter = express.Router();
const TeamController = require("../controllers/TeamController");
const UserAuthMiddleware = require("../middleware/UserAuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");
//Create a new team
TeamRouter.post("/teams", AdminAuthMiddleware, TeamController.postTeam);

//Get all teams
TeamRouter.get("/teams", AdminAuthMiddleware, TeamController.getTeams);

//add user to team
TeamRouter.post(
  "/teams/:id/add-user",
  AdminAuthMiddleware,
  TeamController.postAddUser,
);

module.exports = TeamRouter;
