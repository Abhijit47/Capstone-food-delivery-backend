const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const AppError = require("../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  let token = "";

  // 1. Get token from req
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    token = req.headers.authorization.split(" ")[1];

    // 2. decode token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const { email, exp } = decodedToken;

    // 3. check token is expired or not
    const currentTimeStamp = Math.round(new Date() / 1000);
    if (currentTimeStamp <= exp) {
      // 4. find user with that token
      const user = await User.findOne({ email: email })
        .select("-password");

      // 5. send back this user for next req
      req.user = user;

      // 6. send back this for next req
      // calling next to jump next operation
      next();
    }

  } else {
    // return next(new AppError("Invalid Token", 500));
    return next(new AppError("You are not logged in! Please log in to get access", 401));
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You have not permission to perform this action.", 403));
    }

    next();
  };
};

exports.restaurantProtect = catchAsync(async (req, res, next) => {
  let token = "";

  // 1. Get token from req
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    token = req.headers.authorization.split(" ")[1];

    // 2. decode token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const { email, exp } = decodedToken;

    // 3. check token is expired or not
    const currentTimeStamp = Math.round(new Date() / 1000);
    if (currentTimeStamp <= exp) {
      // 4. find user with that token
      const restaurant = await Restaurant.findOne({ email: email })
        .select("-password");

      // 5. send back this user for next req
      req.restaurant = restaurant;

      // 6. send back this for next req
      // calling next to jump next operation
      next();
    }

  } else {
    // return next(new AppError("Invalid Token", 500));
    return next(new AppError("You are not logged in! Please log in to get access", 401));
  }
});

exports.restaurantRestrictToSignIn = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.body.role)) {
      return next(new AppError("You have not permission to perform this action.", 403));
    }

    next();
  };
};
exports.restaurantRestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.restaurant.role)) {
      return next(new AppError("You have not permission to perform this action.", 403));
    }

    next();
  };
};