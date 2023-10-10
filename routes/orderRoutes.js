const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const orderController = require("./../controllers/orderController");
const router = express.Router();

router.route("/checkout-session/:mealId")
  .get(
    authMiddleware.protect,
    orderController.getCheckoutSession
  );

router.route("/create-order/:foodId")
  .post(
    authMiddleware.protect,
    orderController.createOrderCheckout
  );

module.exports = router;