const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("./../utilities/catchAsync");
const AppError = require("../utilities/appError");
const sendEmail = require("../utilities/email");
const { signUpValidator, signInValidator } = require("./../validators/userValidator");

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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.SignUp = catchAsync(async (req, res, next) => {
  // 1. Get Data from request body and validate
  const validateBody = await signUpValidator(req.body);
  if (!validateBody) {
    return next(new AppError(error.details[0].message, 400));
  }

  // 2. Destructuring body request
  const { name, email, password, phone, role } = validateBody;

  // 3. Check user is already exist or not
  const existUser = await User.findOne({ email: email }).select("-password");

  if (existUser) {
    return next(new AppError("User Already exists! Try to Login", 404));
  }

  // 4. Create a new user
  const user = await User.create({ name, email, password, phone, role });
  user.password = undefined;
  user.updatedAt = undefined;

  // 5. Send back a response to user
  res.status(201).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.SignIn = catchAsync(async (req, res, next) => {
  // 1. Get Data from request body and validate
  const validateBody = await signInValidator(req.body);
  if (!validateBody) {
    return next(new AppError(error.details[0].message, 400));
  }

  // 2. Destructuring body request
  const { email, password } = validateBody;

  // 3. Check user is exist or not in db
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new AppError("Invalid email or password", 404));
  }

  // 4. Check user password is matched or not
  const isValidPassword = await user.compare(password);
  user.password = undefined;
  user.updatedAt = undefined;

  if (!isValidPassword) {
    return next(new AppError("Invalid email or password", 404));
  }

  createSendToken(user, 200, res);

});

exports.getMe = catchAsync(async (req, res, next) => {
  // 1. Get user id from request
  const { id } = req.user;

  // 2. Find user with this id
  const user = await User.findById({ _id: id }).select("-password");
  if (!user) {
    return next(new AppError("User not found with this ID.", 400));
  }

  // 3. Send back a response to user
  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create a error if user POSTs password data
  if (req.body.password) {
    return next(new AppError("This route is not for password updates. please use /update-password.", 400));
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get email from body request
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // Create a random token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send this token to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nif you didn't forgot your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email."
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("The was an error sending email. Try again later!", 500));
  }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired!", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log in user, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById({ _id: req.user.id });
  if (!user) {
    return next(new AppError("There is no user with this id.", 404));
  }

  // 2) Check if posted password and current password is correct or not
  const currentPassword = await user.compare(req.body.currentPassword);
  if (!currentPassword) {
    return next(new AppError("Your current password isn't matched.", 401));
  }

  // 3) If so, update the password
  user.password = req.body.newPassword;
  await user.save();

  // 4) Log in user, send JWT
  createSendToken(user, 200, res);
});