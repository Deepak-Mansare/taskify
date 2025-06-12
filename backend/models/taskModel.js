const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
}, { timestamps: true });

const taskModel = mongoose.model("tasks", taskSchema);
module.exports = taskModel;