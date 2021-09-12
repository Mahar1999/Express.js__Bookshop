const Book = require("../models/book");

// admin/add-book => GET
exports.getAddBook = (req, res, next) => {
  res.render("addBooks", { pageTitle: "Add Books", path: "/admin/add-book" });
};

// admin/add-book => POST
exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const author = req.body.author;

  const book = new Book(title, price, author);
  book.save();
  res.redirect("/");
};

// localhost:3000 => GET
exports.getAllBooks = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "index.html"));

  Book.fetchAll((books) => {
    console.log(books);
    res.render("index", {
      pageTitle: "Home Page",
      path: "/",
      books: books,
      hasBooks: books.length > 0,
    });
  });
};
