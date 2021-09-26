const express = require("express")
const router = express.Router()

const booksController = require("../controllers/home")

router.get("/", booksController.getAllBooks)

//  ':'-refers to the dynamic segement other routes such as 'book-detail/xyz' would not be accessbile if decalred after this route , so we need to define this dynamic segemnt at the end route

router.get("/book-detail/:bookId", booksController.getBookDetail)

router.get("/cart", booksController.getCart)

router.post("/cart", booksController.postCart)

router.post("/cart-delete-item", booksController.postCartDeleteItem)

router.get("/checkout", booksController.getCheckout)

router.get("/orders", booksController.getOrders)

router.post("/create-order", booksController.postOrder)

router.get("/homepage", booksController.getHomepage)

module.exports = router
