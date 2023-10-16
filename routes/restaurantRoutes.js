const express = require('express');
const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/create-restaurant")
  .post(restaurantController.createAndSignupRestaurant);

router.route("/signin")
  .post(
    authMiddleware.restaurantRestrictToSignIn("admin", "moderator"),
    restaurantController.signinRestaurant
  );

router.route("/get-restaurant")
  .get(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "moderator"),
    restaurantController.getRestaurant
  );

router.route("/get-all-restaurants")
  .get(
    restaurantController.getAllRestaurants
  );
module.exports = router;