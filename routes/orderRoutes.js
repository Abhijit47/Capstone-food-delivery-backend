const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const orderController = require("./../controllers/orderController");
const router = express.Router();

router.route("/checkout-session/:mealId")
  .get(
    authMiddleware.protect,
    orderController.getCheckoutSession
  );

module.exports = router;