const express = require("express");
const TaskRouter = express.Router();
const TaskController = require("../controllers/TaskController");
const UserAuthMiddleware = require("../middleware/UserAuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");
const AuthMiddleware = require("../middleware/AuthMiddleware");
//create a new task
TaskRouter.post(
  "/tasks",
  AuthMiddleware,
  AdminAuthMiddleware,
  TaskController.postTask,
);
//Get all tasks
TaskRouter.get(
  "/tasks",
  AuthMiddleware,
  AdminAuthMiddleware,
  TaskController.getAllTasks,
);
//Get a single task by ID
TaskRouter.get(
  "/tasks/:id",
  AuthMiddleware,
  UserAuthMiddleware,
  TaskController.getTaskById,
);
//Update a task
TaskRouter.put("/tasks/:id", AuthMiddleware, TaskController.updateTask);
//Delete a task
TaskRouter.delete(
  "/tasks/:id",
  AuthMiddleware,
  AdminAuthMiddleware,
  TaskController.deleteTask,
);
//Mark complete / incomplete
TaskRouter.patch(
  "/tasks/:id/status",
  AuthMiddleware,
  UserAuthMiddleware,
  TaskController.updateTaskStatus,
);

module.exports = TaskRouter;
