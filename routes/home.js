const express = require("express");
const router = express.Router();

const path = require("path");

const booksController = require("../controllers/book");

// localhost:3000 => GET
router.get("/", booksController.getAllBooks);

module.exports = router;
