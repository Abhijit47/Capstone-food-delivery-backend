const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const bookingController = require("./../controllers/bookingController");
const router = express.Router();

router.route("/checkout-session/:mealId")
  .get(
    authMiddleware.protect,
    bookingController.getCheckoutSession
  );

module.exports = router;