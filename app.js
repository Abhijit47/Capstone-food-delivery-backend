const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "./config.env" });

const userRouter = require("./routes/userRoutes");
const foodItemRouter = require("./routes/foodItemRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const orderRouter = require("./routes/orderRoutes");
const queryRouter = require("./routes/queryRoutes");
const AppError = require("./utilities/appError");
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Food delivery Portal." });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/foodItem", foodItemRouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/query", queryRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;