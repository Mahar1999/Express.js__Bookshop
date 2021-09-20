const Book = require("../models/book");
const Cart = require("../models/cart");

exports.getAllBooks = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "index.html"));
  Book.fetchAll()
    .then(([rows, filedData]) => {
      console.log(rows);
      res.render("shop/book-list", {
        pageTitle: "Home Page",
        path: "/",
        books: rows,
      });
    })
    .catch((err) => console.log(err));
};

exports.getBookDetail = (req, res, next) => {
  const bookId = req.params.bookId; // use name used in Router after colon

  Book.findById(bookId)
    .then(([rows]) => {
      console.log(rows);
      res.render("shop/book-detail", {
        pageTitle: "Book Detail",
        path: "/",
        books: rows,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.fetchCart((cart) => {
    Book.fetchAll((books) => {
      const cartBooks = [];

      for (let book of books) {
        const cartbookData = cart.books.find((item) => item.id === book.id);
        if (cartbookData) {
          cartBooks.push({ bookData: book, qty: cartbookData.qty });
        }
      }

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        books: cartBooks,
      });
    });
  });
};

exports.postCartDeleteItem = (req, res, next) => {
  const bookId = req.body.bookId;

  Book.findById(bookId, (book) => {
    Cart.deleteBook(bookId, book[0].price);
    console.log(bookId, book[0].price);
    res.redirect("/cart");
  });
};

exports.postCart = (req, res, next) => {
  const bookId = req.body.bookId;
  Book.findById(bookId, (book) => {
    Cart.addBook(bookId, book[0].price);
  });
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout Page",
    path: "shop/checkout",
  });
};

exports.getHomepage = (req, res, next) => {
  res.render("shop/homepage", {
    pageTitle: "Home Page",
    path: "shop/homepage",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Orders", path: "/orders" });
};
