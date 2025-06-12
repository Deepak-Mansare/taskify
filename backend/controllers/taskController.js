const taskModel = require("../models/taskModel");

const createTask = async (req, res) => {
    try {
        const { title, description, status, userId: assignedUserId } = req.body;
        let userIdToAssign = req.user.role === "admin" && assignedUserId ? assignedUserId : req.user.userId;

        await taskModel.create({ userId: userIdToAssign, title, description, status });
        res.status(201).send({ message: "Task created", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not created", success: false, error: err.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { userId: req.user.userId };
        const tasks = await taskModel.find(filter).populate("userId", "name email").sort({ createdAt: -1 });
        res.status(200).send({ tasks, success: true });
    } catch (err) {
        res.status(500).send({ message: "Tasks not found", success: false, error: err.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id).populate("userId", "name email");
        if (!task) return res.status(404).send({ message: "Task not found", success: false });
        res.status(200).send({ task, success: true });
    } catch (err) {
        res.status(500).send({ message: "Error fetching task", success: false, error: err.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const updated = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).send({ message: "Task not found", success: false });
        res.status(200).send({ message: "Task updated", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not updated", success: false, error: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deleted = await taskModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send({ message: "Task not found", success: false });
        res.status(200).send({ message: "Task deleted", success: true });
    } catch (err) {
        res.status(500).send({ message: "Task not deleted", success: false, error: err.message });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };