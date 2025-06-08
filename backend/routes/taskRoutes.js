const express = require("express")
const router = express.Router()
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController")

router.post("/createTask", createTask)
router.get("/getTasks", getTasks)
router.get("/getTask/:id", getTaskById)
router.put("/updateTask/:id", updateTask)
router.delete("/deleteTask/:id", deleteTask)

module.exports = router