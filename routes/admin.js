const express = require("express");
const router = express.Router();

const booksController = require("../controllers/book");

// admin/add-book => GET
router.get("/add-book", booksController.getAddBook);

// admin/add-book => POST
router.post("/add-book", booksController.postAddBook);

module.exports = router;
