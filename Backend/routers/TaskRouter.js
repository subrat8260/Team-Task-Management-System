const express = require("express");
const TaskRouter = express.Router();
const TaskController = require("../controllers/TaskController");
const UserAuthMiddleware = require("../middleware/UserAuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");
//create a new task
TaskRouter.post("/tasks", AdminAuthMiddleware, TaskController.postTask);
//Get all tasks
TaskRouter.get("/tasks", AdminAuthMiddleware, TaskController.getAllTasks);
//Get a single task by ID
TaskRouter.get("/tasks/:id", UserAuthMiddleware, TaskController.getTaskById);
//Update a task
TaskRouter.put("/tasks/:id", TaskController.updateTask);
//Delete a task
TaskRouter.delete("/tasks/:id", AdminAuthMiddleware, TaskController.deleteTask);
//Mark complete / incomplete
TaskRouter.patch(
  "/tasks/:id/status",
  UserAuthMiddleware,
  TaskController.updateTaskStatus,
);

module.exports = TaskRouter;
