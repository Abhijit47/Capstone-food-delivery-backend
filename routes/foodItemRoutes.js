const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const foodItemController = require("./../controllers/foodItemController");
const router = express.Router();

router.route("/create-item")
  .post(
    // authMiddleware.protect,
    authMiddleware.restaurantProtect,
    // authMiddleware.restrictTo("admin"),
    authMiddleware.restaurantRestrictTo("admin"),
    foodItemController.createFoodItem
  );

router.route("/all-food-items")
  .get(foodItemController.getAllFoodItems);

router.route("/update-item")
  .patch(
    // authMiddleware.protect,
    authMiddleware.restaurantProtect,
    // authMiddleware.restrictTo("admin"),
    authMiddleware.restaurantRestrictTo("admin"),
    foodItemController.updateFoodItem
  );

router.route("/delete-item/:id")
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    foodItemController.deleteFoodItem
  );

module.exports = router;