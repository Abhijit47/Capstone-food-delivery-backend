const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/signup")
  .post(userController.SignUp);

router.route("/signin")
  .post(userController.SignIn);

router.route("/get-me")
  .get(
    authMiddleware.protect,
    userController.getMe
  );

router.route("/forgot-password")
  .post(userController.forgotPassword);

router.route("/reset-password/:token")
  .patch(userController.resetPassword);

router.route("/update-password")
  .patch(
    authMiddleware.protect,
    userController.updatePassword
  );

router.route("/update-me")
  .patch(
    authMiddleware.protect,
    userController.updateMe
  );
module.exports = router;