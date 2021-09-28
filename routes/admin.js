const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin")
const isAuth = require("../middlewares/isAuth")

// admin/add-book => GET
router.get("/add-book", isAuth, adminController.getAddBook)

// admin/add-book => POST
router.post("/add-book", isAuth, adminController.postAddBook)

// admin/edit-books => POST , here we define :bookId at last , as :boojId is dynamic and would catch all routes so it has be at last
router.get("/edit-book/:bookId", isAuth, adminController.getEditBook)

// admin/edit-book => POST
router.post("/edit-book", isAuth, adminController.postEditBooks)

// admin/books => POST
router.get("/books", isAuth, adminController.getBooks)

// admin/delete-product => POST
router.post("/delete-book", isAuth, adminController.postDeleteBook)

module.exports = router
