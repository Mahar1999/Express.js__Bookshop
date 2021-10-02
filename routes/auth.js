const express = require("express")
const router = express.Router()
const { check, body } = require("express-validator/check")
const User = require("../models/user")

const authController = require("../controllers/auth")

router.get("/login", authController.getLogin)

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email and password")
      .normalizeEmail(),
    body("password", "Password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
)

router.post("/logout", authController.postLogout)

router.get("/signup", authController.getSignUp)

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email and password")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-mail already in use , please use a different one."
            )
          }
        })
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter password with numbers and characters only with atleast 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match")
        }
        return true
      })
      .trim(),
  ],
  authController.postSignUp
)

router.get("/reset", authController.getReset)

router.post("/reset", authController.postReset)

router.get("/reset/:token", authController.getNewPassword)

router.post("/new-password", authController.postNewPassword)

module.exports = router
