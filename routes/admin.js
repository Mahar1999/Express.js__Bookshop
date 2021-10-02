const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin")
const isAuth = require("../middlewares/isAuth")

const { body, check } = require("express-validator/check")

// admin/add-book => GET
router.get("/add-book", isAuth, adminController.getAddBook)

// admin/add-book => POST
router.post(
  "/add-book",
  isAuth,
  [
    body("title").isAlphanumeric().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat().trim(),
    body("author").isAlphanumeric().trim(),
  ],
  adminController.postAddBook
)

// admin/edit-books => POST , here we define :bookId at last , as :boojId is dynamic and would catch all routes so it has be at last
router.get("/edit-book/:bookId", isAuth, adminController.getEditBook)

// admin/edit-book => POST
router.post(
  "/edit-book",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat().trim(),
    body("author").isAlphanumeric().trim(),
  ],
  isAuth,
  adminController.postEditBooks
)

// admin/books => POST
router.get("/books", isAuth, adminController.getBooks)

// admin/delete-product => POST
router.post("/delete-book", isAuth, adminController.postDeleteBook)

module.exports = router
