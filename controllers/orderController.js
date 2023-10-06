const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FoodItem = require("./../models/foodItemModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");

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
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
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