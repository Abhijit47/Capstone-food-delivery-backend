const express = require('express');
const authMiddleware = require("./../middlewares/authMiddleware");
const foodItemController = require("./../controllers/foodItemController");
const router = express.Router();

// Access only restaurant
router.route("/create-item")
  .post(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "owner", "moderator"),
    foodItemController.createFoodItem
  );

// Access for everyone
router.route("/all-food-items")
  .get(foodItemController.getAllFoodItems);

// Access only logged in user
router.route("/get-one-food/:foodId")
  .get(
    authMiddleware.protect,
    foodItemController.getOneFood
  );

// Access only restaurant
router.route("/update-item")
  .patch(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "owner", "moderator"),
    foodItemController.updateFoodItem
  );

// Access only restaurant
router.route("/delete-item/:id")
  .delete(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "owner", "moderator"),
    foodItemController.deleteFoodItem
  );

module.exports = router;