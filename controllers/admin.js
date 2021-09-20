const Book = require("../models/book");
const Cart = require("../models/cart");

exports.getBooks = (req, res, next) => {
  Book.fetchAll()
    .then(([rows, filedData]) => {
      res.render("admin/books", {
        pageTitle: "Books",
        path: "/admin/books",
        books: rows,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddBook = (req, res, next) => {
  res.render("admin/addBooks", {
    pageTitle: "Add Books",
    path: "/admin/add-book",
    editing: false,
  });
};

exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const author = req.body.author;
  const imageUrl = req.body.imageUrl;

  const book = new Book(title, price, author, imageUrl);
  
  book
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getEditBook = (req, res, next) => {
  const bookId = req.params.bookId;
  const editMode = req.query.edit; // for 'edit' key in queryparameters

  if (!editMode) {
    return res.redirect("/");
  }

  Book.findById(bookId, (book) => {
    if (!book) res.redirect("/");
    // console.log(book[0], editMode, bookId);
    res.render("admin/addBooks", {
      pageTitle: "Edit Books",
      path: "/admin/editBooks",
      editing: editMode,
      book: book[0],
    });
  });
};

exports.postEditBooks = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const author = req.body.author;
  const imageUrl = req.body.imageUrl;
  const bookId = req.body.bookId;

  console.log(title, price, author, imageUrl, bookId);

  const updatedBook = new Book(title, price, author, imageUrl, bookId);
  updatedBook.save();
  res.redirect("/");
};

exports.postDeleteBook = (req, res, next) => {
  const bookId = req.body.bookId;
  console.log(bookId);
  Book.deleteById(bookId);
  res.redirect("/");
};
