const Book = require("../models/book");
const Cart = require("../models/cart");

exports.getBooks = (req, res, next) => {
  // Book.findAll({ raw: true }) - for getting books for all users

  // req.user.getBooks() - for getting books for a single user
  req.user
    .getBooks()
    .then((books) => {
      // console.log(books);
      res.render("admin/books", {
        pageTitle: "Books",
        path: "/admin/books",
        books: books,
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

  Book.create({
    title: title,
    price: price,
    author: author,
    imageUrl: imageUrl,
    userId: req.user.id,
  })
    .then(() => {
      console.log("Book Created !!!");
      res.redirect("/admin/books");
    })
    .catch((err) => console.log(err));
};

exports.getEditBook = (req, res, next) => {
  const bookId = req.params.bookId;
  const editMode = req.query.edit; // for 'edit' key in queryparameters

  if (!editMode) {
    return res.redirect("/");
  }

  // Book.findByPk(bookId, { raw: true }) - for all books searched by bookId

  // For books used by user searched by bookId
  req.user
    .getBooks({ where: { id: bookId } })
    .then((books) => {
      const book = books[0];
      res.render("admin/addBooks", {
        pageTitle: "Edit Books",
        path: "/admin/editBooks",
        editing: editMode,
        book: book,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditBooks = async (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedAuthor = req.body.author;
  const updatedImageUrl = req.body.imageUrl;
  const bookId = req.body.bookId;

  /************** Herer the book.save() is not responding , need to debug ****************/
  // Book.findByPk(bookId, { raw: true })
  //   .then((book) => {
  //     (book.title = updatedTitle),
  //       (book.price = updatedPrice),
  //       (book.author = updatedAuthor),
  //       (book.imageUrl = updatedImageUrl);

  //     console.log(book);
  //     return book.save();
  //   })
  //   .then((res) => console.log("UPDATED PRODUCT"))
  //   .catch((err) => console.log(err));
  /************** Herer the book.save() is not responding , need to debug ****************/

  try {
    await Book.update(
      {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        author: updatedAuthor,
      },
      {
        where: { id: bookId },
      }
    );

    res.redirect("/admin/books");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteBook = async (req, res, next) => {
  const bookId = req.body.bookId;

  Book.findByPk(bookId)
    .then((book) => book.destroy())
    .then(() => {
      console.log("DELETED SUCCESSFULLY");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
