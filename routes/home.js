const express = require("express")
const router = express.Router()

const booksController = require("../controllers/home")
const isAuth = require("../middlewares/isAuth")

router.get("/", isAuth, booksController.getAllBooks)

//  ':'-refers to the dynamic segement other routes such as 'book-detail/xyz' would not be accessbile if decalred after this route , so we need to define this dynamic segemnt at the end route

router.get("/book-detail/:bookId", isAuth, booksController.getBookDetail)

router.get("/cart", isAuth, booksController.getCart)

router.post("/cart", isAuth, booksController.postCart)

router.post("/cart-delete-item", isAuth, booksController.postCartDeleteItem)

router.get("/checkout", isAuth, booksController.getCheckout)

router.get("/orders", isAuth, booksController.getOrders)

router.post("/create-order", isAuth, booksController.postOrder)

router.get("/orders/:orderId", isAuth, booksController.getInvoice)

router.get("/homepage", isAuth, booksController.getHomepage)

module.exports = router
