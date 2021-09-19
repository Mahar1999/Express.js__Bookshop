const { json } = require("express");
const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  // Add product to the Cart
  static addBook(id, bookPrice) {
    // Fetch the book
    fs.readFile(p, (err, fileContent) => {
      let cart = { books: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // add to new or exisiting
      const exisitingBookIndex = cart.books.findIndex((item) => item.id === id);
      const exisitingBook = cart.books[exisitingBookIndex];
      let updateBook;

      if (exisitingBook) {
        updateBook = { ...exisitingBook };
        updateBook.qty = updateBook.qty + 1;

        cart.books = [...cart.books];
        cart.books[exisitingBookIndex] = updateBook;
      } else {
        updateBook = { id: id, qty: 1 };
        cart.books = [...cart.books, updateBook];
      }

      // update / write
      cart.totalPrice = cart.totalPrice + +bookPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  // Delete product from the Cart
  static deleteBook(id, bookPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { books: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const updatedBooks = { ...cart };
      const book = updatedBooks.books.find((item) => item.id === id);
      if (!book) return //returning when no product found in cart
      const bookQty = book.qty;

      updatedBooks.books = updatedBooks.books.filter((item) => item.id !== id);
      updatedBooks.totalPrice = updatedBooks.totalPrice - bookPrice * bookQty;

      fs.writeFile(p, JSON.stringify(updatedBooks), (err) => console.log(err));
    });
  }

  // fetch Cart Items
  static fetchCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      cart ? cb(cart) : cb(null);
    });
  }
};
