const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const UserRouter = require("./routers/UserRouter");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const TaskRouter = require("./routers/TaskRouter");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);
const PORT = process.env.PORT || 3000;
const MONGO_URI = `${process.env.MONGO_URI}`;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to Mongoose Successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
