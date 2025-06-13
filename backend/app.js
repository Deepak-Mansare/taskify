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

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
