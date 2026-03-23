const Task = require("../models/TaskModel");

exports.postTask = async (req, res) => {
  const { title, description, assignTo } = req.body;
  const newTask = new Task({
    title,
    description,
    assignTo,
    createdBy: req.user._id,
  });
  await newTask.save();
  res.status(201).json({ message: "Task created successfully", task: newTask });
};

//get all tasks
exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json({ tasks });
};
// Get a single task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json({ task });
};
//update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignTo } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      assignTo,
    },
    { new: true },
  );
  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  res
    .status(200)
    .json({ message: "Task updated Successfully", task: updatedTask });
};
//delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json({ message: "Task deleted successfully" });
};
// mark completed / incomplete
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  res
    .status(200)
    .json({ message: "Task status updated successfully", task: updatedTask });
};
