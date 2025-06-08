const taskModel = require("../models/taskModel");

// Create new task
const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.userId;
    try {
        await taskModel.create({ userId, title, description, status });
        res.status(201).send({ message: "Task created", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not created", success: false, error: err.message });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    const userId = req.user.userId;
    try {
        const tasks = await taskModel.find({ userId });
        res.status(200).send({ tasks, success: true });
    } catch (err) {
        res.status(500).send({ message: "Tasks not found", success: false, error: err.message });
    }
};

// Get single task
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.findById(id);
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
        const { userId, title, description, status } = req.body;
        const existingTask = await taskModel.findById(id);
        if (!existingTask) {
            return res.status(404).send({ message: "Task not found", success: false });
        }
        await taskModel.findByIdAndUpdate(id, { userId, title, description, status }, { new: true });
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
