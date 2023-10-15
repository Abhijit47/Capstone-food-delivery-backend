const express = require("express");
const queryController = require("../controllers/queryController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/contact-us").
  post(queryController.contactUs);

router.route("/get-queries")
  .get(
    authMiddleware.restaurantProtect,
    authMiddleware.restaurantRestrictTo("admin", "moderator"),
    queryController.getQueries
  );

module.exports = router;