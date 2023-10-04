const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurantModel");
const AppError = require("../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

const signToken = (payload) => {
  return jwt.sign(
    payload, process.env.ACCESS_TOKEN,
    { expiresIn: process.env.EXPIRES_IN }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken({ id: user._id, name: user.name, email: user.email });

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token
    },
  });
};

// Restaurant signup and create
exports.createAndSignupRestaurent = catchAsync(async (req, res, next) => {
  // Get data from req.body and validate

  const { name, address, cuisine, rating, openingTime, closingTime, username, password, email, role } = req.body;

  // check restaurant is exist or not
  const existRestaurant = await Restaurant.findOne({ email: email }).select("-password");
  if (existRestaurant) {
    return next(new AppError("Restaurant already exist. Try to login!", 400));
  }

  // create a new restaurant with validated data
  const restaurant = await Restaurant.create({
    name, address, cuisine, rating, openingTime, closingTime, username, password, email, role
  });

  restaurant.password = undefined;
  restaurant.updatedAt = undefined;

  // and populate fooditems here

  // Send a response back
  res.status(201).json({
    success: "success",
    data: {
      restaurant
    }
  });
});

// Restaurant signin
exports.signinRestaurent = catchAsync(async (req, res, next) => {
  // 1. Get email and password from body request
  const { email, password, role } = req.body;

  // 2. Check if restaurent email is exist or not
  const restaurant = await Restaurant.findOne({ email: email });
  if (!restaurant) {
    return next(new AppError("Invalid email or password", 404));
  }

  // 3. check password for this restaurant
  const isValidPassword = await restaurant.compare(password);
  restaurant.password = undefined;
  restaurant.updatedAt = undefined;
  if (!isValidPassword) {
    return next(new AppError("Invalid email or password", 404));
  }

  // 4. create a unique token for each restaurant and login
  createSendToken(restaurant, 200, res);

});

// Get Restaurant details
exports.getRestaurant = catchAsync(async (req, res, next) => {
  // Get one restaurent details only auth user

  if (!req.restaurant) {
    return next(new AppError("User Auth failed!", 401));
  }

  const restaurant = await Restaurant.findOne({ _id: req.restaurant.id })
    .select("-password -updatedAt")
    .populate("menu", "itemName quantity price description picture")
    .exec();

  res.status(200).json({
    status: "success",
    data: {
      restaurant
    }
  });

});

// Get All Restaurents
exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  // Get All Restaurants details
  const restaurants = await Restaurant.find({})
    .select("-password -updatedAt")
    .populate("menu", "itemName quantity price description picture")
    .exec();

  res.status(200).json({
    status: "success",
    data: {
      restaurants
    }
  });
});