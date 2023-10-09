const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const restaurant = require("../models/restaurantModel");
const FoodItem = require("../models/foodItemModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const meal = await FoodItem.findById(req.params.mealId);
  if (!meal) {
    return next(new AppError("No meal found with this Id.", 400));
  }

  // console.log(`${req.protocol}://${req.get("host")}/`);
  // console.log(`${req.protocol}://${req.get("host")}/meal/${meal._id}`);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get("host")}/`,
    success_url: `http://localhost:3000/?foodItem=${req.params.mealId}&user=${req.user.id}&price=${meal.price}`,
    // cancel_url: `${req.protocol}://${req.get("host")}/meal/${meal._id}`,
    cancel_url: `http://localhost:3000/meal/${meal._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.mealId,
    invoice_creation: {
      enabled: true
    },
    line_items: [{
      price_data: {
        currency: 'inr',
        unit_amount: meal.price * 100,
        product_data: {
          name: `${meal.itemName} Meal`,
          description: meal.description,
          images: [`${meal.picture}`],
        },
      },
      quantity: 1
    }],

  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // Extract data from query string
  const { foodItem, user, price } = req.query;

  // check required query parameters are not available or not
  if (!foodItem && !user && !price) return next();

  // create a order
  await Order.create({ foodItem, user, price });

  res.redirect("http://localhost:3000");
});