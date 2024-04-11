const express = require("express");
const expValidator = require("express-validator");

const authController = require("../controllers/auth");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const User = require("../models/user");

router.put(
  "/signup",
  [
    expValidator
      .body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail adress already exmist");
          }
        });
      })
      .normalizeEmail(),
    expValidator.body("password").trim().isLength({ min: 5 }),

    expValidator.body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [expValidator.body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
