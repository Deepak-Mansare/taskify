const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Connection failed:", err));

app.use("/user", userRouter);
app.use("/task", authMiddleware, taskRouter);

app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
