const FoodItem = require("./../models/foodItemModel");
const Restaurant = require("./../models/restaurantModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

// only admin can access this route
exports.createFoodItem = catchAsync(async (req, res, next) => {
  // 1. Get fields name from req.body and validate
  const { itemName, quantity, price, description, picture } = req.body;

  // 2. check all fields are validate or not
  if (!req.body) {
    return next(new AppError("All fields required.", 400));
  }

  // 3. create a new item
  const item = await FoodItem.create({ itemName, quantity, price, description, picture });

  // 4. Find the retaurant update the food item also.
  const menu = await Restaurant.findByIdAndUpdate(
    { _id: req.restaurant._id },
    { $push: { menu: item._id } },
    { new: true }
  );

  // 4. Send back a response to user
  res.status(201).json({
    status: "success",
    data: {
      item
    }
  });
});

// all users can access this route
exports.getAllFoodItems = catchAsync(async (req, res, next) => {
  // Get All food items from db
  const items = await FoodItem.find({})
    .select("-updatedAt").lean();

  res.status(200).json({
    status: "success",
    data: {
      items
    }
  });
});

// get one food item
exports.getOneFood = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find one food by id
  const food = await FoodItem.findById({ _id: id }).select("-updatedAt");
  if (!food) {
    return next(new AppError("No food found by this Id.", 400));
  }

  // send a response back
  res.status(200).json({
    status: "success",
    data: {
      food
    }
  });

});

// only admin can access this route => id
exports.updateFoodItem = catchAsync(async (req, res, next) => {

  // 1. Get ID and fields name from req.body and validate
  const { id, itemName, quantity, price, description, picture } = req.body;

  // 2. check item is exist or not
  const item = await FoodItem.findById({ _id: id });
  // console.log(item);
  if (!item) {
    return next(new AppError("There is no items to update.", 400));
  }

  // 3. if exist so, update the document
  const updatedItem = await FoodItem.findOneAndUpdate(
    { _id: id },
    { itemName, quantity, price, description, picture },
    { new: true }
  );

  // 4. send back a response to user
  res.status(200).json({
    status: "success",
    data: {
      updatedItem
    }
  });
});

// only admin can access this route => id
exports.deleteFoodItem = catchAsync(async (req, res, next) => {
  // Get Id from req.params
  const { id } = req.params;
  // console.log(id);

  // Find the exact document in db
  const item = await FoodItem.findById({ _id: id });
  if (!item) {
    return next(new AppError("There is no items to update.", 400));
  }

  // if available, delete the document
  await FoodItem.findByIdAndDelete({ _id: id });

  // send a response back
  res.status(204).json({
    status: "success",
  });
});