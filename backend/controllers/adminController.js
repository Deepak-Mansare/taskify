const userModel = require("../models/userModel");

// Get all users 
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({ role: "admin" }).select("-password");
        res.status(200).json({ success: true, admins });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
            error: error.message,
        });
    }
};

//  Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // password should not be updated
        if (updateData.password) {
            delete updateData.password;
        }

        const allowedUpdates = ['name', 'email', 'role'];
        const invalidFields = Object.keys(updateData).filter(
            field => !allowedUpdates.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid update fields: ${invalidFields.join(", ")}`,
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message,
        });
    }
};

//  Delete user 
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getAllAdmins
};
