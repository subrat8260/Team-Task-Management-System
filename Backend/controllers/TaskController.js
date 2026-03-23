const Task = require("../models/TaskModel");

exports.postTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const { title, description, assignTo } = req.body;
    if (!title || !description || !assignTo) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newTask = new Task({
      title,
      description,
      assignTo,
      createdBy: req.user._id,
    });
    await newTask.save();
    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const { search, status } = req.query;
    let filter = {
      $and: [
        {
          $or: [{ createdBy: req.user._id }, { assignTo: req.user._id }],
        },
      ],
    };
    if (search) {
      filter.$and.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (status) {
      filter.status = status;
    }
    const total = await Task.countDocuments(filter);
    const task = await Task.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Authorization check
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      task.assignTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }
    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    //Authorization check
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }
    const { title, description, assignTo } = req.body;
    const updateTask = {};
    if (title) updateTask.title = title;
    if (description) updateTask.description = description;
    if (assignTo) updateTask.assignTo = assignTo;
    const updatedTask = await Task.findByIdAndUpdate(id, updateTask, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task updated Successfully", task: updatedTask });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== task.createdBy.toString()
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};
// mark completed / incomplete
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    //Autherization check
    if (
      task.assignTo.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }
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
    return res
      .status(200)
      .json({ message: "Task status updated successfully", task: updatedTask });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
