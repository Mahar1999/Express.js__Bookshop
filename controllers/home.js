const Book = require("../models/book");
const Cart = require("../models/cart");

exports.getAllBooks = (req, res, next) => {
  Book.findAll({ raw: true })
    .then((books) => {
      // console.log(books);
      res.render("shop/book-list", {
        pageTitle: "Home Page",
        path: "/",
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.getBookDetail = (req, res, next) => {
  const bookId = req.params.bookId; // use name used in Router after colon

  Book.findByPk(bookId, { raw: true })
    .then((book) => {
      // console.log(book);

      res.render("shop/book-detail", {
        pageTitle: "Book Detail",
        path: "/",
        books: [book],
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getBooks()
        .then((books) => {
          console.log(books);
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            books: books,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const bookId = req.body.bookId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getBooks({ where: { id: bookId } });
    })
    .then((books) => {
      const book = books[0];
      return books.cartItem.destroy();
    })
    .then((res) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  Book.findById(bookId, (book) => {
    Cart.deleteBook(bookId, book[0].price);

    res.redirect("/cart");
  });
};

exports.postCart = (req, res, next) => {
  const bookId = req.body.bookId;
  let newQty = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getBooks({ where: { id: bookId } });
    })
    .then((books) => {
      let book;

      if (books.lenght > 0) {
        book = books[0];
      }

      if (book) {
        const oldQty = book.cartItem.quantity;
        newQty = oldQty + 1;
        return book;
      }

      return Book.findByPk(bookId);
    })
    .then((book) => {
      return fetchedCart.addBook(book, { through: { quantity: newQty } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCreateOrder = (req, res, next) => {
  // creating orderItem using the Sequelize
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
