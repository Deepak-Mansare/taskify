const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRouter = require("./routes/userRoutes")
const taskRouter = require("./routes/taskRoutes")
const authMiddleware = require('./middleware/authMiddleware')
const adminMiddleware = require("./middleware/adminMiddleware")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch(err => console.log(" Connection failed:", err))

app.use("/user", userRouter)
app.use("/task", authMiddleware, taskRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`)
})
