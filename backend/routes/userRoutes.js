const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const { getAllUsers, getAllAdmins, updateUser, deleteUser } = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only routes
router.get("/getUsers", authMiddleware, adminMiddleware, getAllUsers);
router.get("/getAdmins", authMiddleware, adminMiddleware, getAllAdmins);
router.put("/updateUser:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/deleteUser:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
