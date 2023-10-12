const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const FoodItem = require("../models/foodItemModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const meal = await FoodItem.findById(req.params.mealId);
  if (!meal) {
    return next(new AppError("No meal found with this Id.", 400));
  }

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get("host")}/`,
    success_url: `http://localhost:3000/`,
    // cancel_url: `${req.protocol}://${req.get("host")}/meal/${meal._id}`,
    cancel_url: `http://localhost:3000/meal/${meal._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.mealId,

    line_items: [{
      // price: meal.price * 100, // price or price data required
      price_data: {
        currency: 'inr',
        unit_amount: meal.price * 100,
        // unit_amount_decimal: meal.price / 100,
        product_data: {
          name: `${meal.itemName} Meal`,
          description: meal.description,
          images: [`${meal.picture}`],
        },
      },
      quantity: 1,
      // adjustable_quantity: {
      //   enabled: true,
      //   maximum: 5,
      //   minimum: 1
      // }
    }],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // Get data from body request and user request
  const { quantity, price } = req.body;

  // 1) Get user from request
  const user = req.user.id;

  // 2) Find the restaurent with the params foodId
  const restaurant = await Restaurant.findOne({ menu: req.params.foodId }).lean()
    .select("_id name email menu");

  // 3) Find the food with params id
  const foodItem = await FoodItem.findById({ _id: req.params.foodId }).lean()
    .select("-updatedAt");

  // 4) Create an Order
  const order = await Order.create({
    user,
    restaurant: restaurant._id,
    items: {
      foodItem: foodItem._id,
      quantity,
    },
    price
  });

  // 5) decrement the food item in foodItem Model
  await FoodItem.findByIdAndUpdate(
    { _id: foodItem._id },
    { $inc: { quantity: -quantity } },
    { new: true }
  );

  // 6) update the user collection orders field
  await User.findByIdAndUpdate(
    { _id: user },
    { $push: { orders: order._id } },
    { new: true }
  );

  // 7) Send back a response to user
  res.status(201).json({
    status: "success",
    data: {
      order
    }
  });
});