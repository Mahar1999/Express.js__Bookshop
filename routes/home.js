const express = require("express");
const router = express.Router();

const booksController = require("../controllers/home");

// localhost:3000 => GET
router.get("/", booksController.getAllBooks);

// localhost:3000/books => GET , ':' refers to the dynamic segement other routes such as 'book-detail/xyz' would not be accessbile if decalred after this route , so we need to define this dynamic segemnt at the end route
router.get("/book-detail/:bookId", booksController.getBookDetail);

// localhost:3000/cart => GET
router.get("/cart", booksController.getCart);

//localhost:3000/cart => POST
router.post("/cart", booksController.postCart);

//localhost:3000/cart-delete-item=> POST
router.post("/cart-delete-item", booksController.postCartDeleteItem);

// localhost:3000/checkout => GET
router.get("/checkout", booksController.getCheckout);

// localhost:3000/orders => GET
router.get("/orders", booksController.getOrders);

// localhost:3000/homepage => GET
router.get("/homepage", booksController.getHomepage);

// localhost:3000/create-order => POST
router.post("/create-order", booksController.getCreateOrder);

module.exports = router;
