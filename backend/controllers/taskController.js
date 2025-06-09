const taskModel = require("../models/taskModel");

// Create new task
const createTask = async (req, res) => {
    try {
        const { title, description, status, userId: assignedUserId } = req.body;
        let userIdToAssign;

        if (req.user.role === "admin" && assignedUserId) {
            userIdToAssign = assignedUserId; // admin assigns task to this user
        } else {
            userIdToAssign = req.user.userId; // normal user assigns task to self
        }

        await taskModel.create({ userId: userIdToAssign, title, description, status });
        res.status(201).send({ message: "Task created", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not created", success: false, error: err.message });
    }
};

// Get all tasks (all if admin, else user tasks)
const getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === "admin") {
            // Admin sees all tasks
            tasks = await taskModel.find().populate("userId", "name email").sort({ createdAt: -1 });
        } else {
            // Normal user sees only their tasks
            tasks = await taskModel.find({ userId: req.user.userId }).populate("userId", "name email").sort({ createdAt: -1 });
        }
        res.status(200).send({ tasks, success: true });
    } catch (err) {
        res.status(500).send({ message: "Tasks not found", success: false, error: err.message });
    }
};

// Get single task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.findById(id).populate("userId", "name email");
        if (!task) {
            return res.status(404).send({ message: "Task not found", success: false });
        }
        res.status(200).send({ task, success: true });
    } catch (err) {
        res.status(500).send({ message: "Error fetching task", success: false, error: err.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const existingTask = await taskModel.findById(id);
        if (!existingTask) {
            return res.status(404).send({ message: "Task not found", success: false });
        }

        await taskModel.findByIdAndUpdate(id, updateFields, { new: true });
        res.status(200).send({ message: "Task updated", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not updated", success: false, error: err.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTask = await taskModel.findByIdAndDelete(id);
        if (!existingTask) {
            return res.status(404).send({ message: "Task not found", success: false });
        }
        res.status(200).send({ message: "Task deleted", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not deleted", success: false, error: err.message });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
