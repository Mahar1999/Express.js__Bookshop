const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

// admin/add-book => GET
router.get("/add-book", adminController.getAddBook);

// admin/add-book => POST
router.post("/add-book", adminController.postAddBook);

// admin/edit-books => POST , here we define :bookId at last , as :boojId is dynamic and would catch all routes so it has be at last
router.get("/edit-book/:bookId", adminController.getEditBook);

// admin/edit-book => POST
router.post("/edit-book", adminController.postEditBooks);

// admin/books => POST
router.get("/books", adminController.getBooks);

// admin/delete-product => POST
router.post("/delete-book", adminController.postDeleteBook);

module.exports = router;
