const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth")
const isAuth = require("../middlewares/isAuth")

router.get("/login", authController.getLogin)

router.post("/login", authController.postLogin)

router.post("/logout", authController.postLogout)

router.get("/signup", authController.getSignUp)

router.post("/signup", authController.postSignUp)

module.exports = router
