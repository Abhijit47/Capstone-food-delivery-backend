const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FoodItem = require("./../models/foodItemModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

// console.log(stripe.checkout.sessions);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const meal = await FoodItem.findById(req.params.id);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.mealId,
    line_items: [
      {
        name: `${meal.name} Meal`,
        description: meal.description,
        images: [`${meal.picture}`],
        amount: meal.price,
        currency: "inr",
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session
  });
});