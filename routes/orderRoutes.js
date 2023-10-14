const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const orderController = require("./../controllers/orderController");
const router = express.Router();

router.route("/checkout-session")
  .post(
    authMiddleware.protect,
    orderController.createCheckoutSession,
  );

router.route("/create-order")
  .post(
    authMiddleware.protect,
    orderController.createOrder
  );

router.route("/get-all-orders")
  .get(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "owner", "moderator"),
    orderController.getAllOrdersByRestaurant
  );

router.route("/get-user-orders")
  .get(
    authMiddleware.protect,
    orderController.getUserOrders
  );

module.exports = router;