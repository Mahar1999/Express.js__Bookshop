const fs = require("fs");
const path = require("path");
const Cart = require("../models/cart");

// get to rootFolder of project -> data -> books.json
const p = path.join(path.dirname(require.main.filename), "data", "books.json");

const getBooksFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Book {
  constructor(title, price, author, imageUrl, id) {
    (this.title = title),
      (this.price = price),
      (this.author = author),
      (this.imageUrl = imageUrl),
      (this.id = id);
  }

  // Updating 1 : we pass an id parameter , which is going to have value if book exist or null if does not
  // Updating 2 : If the book id exsist then we update the book or we create a new id for the new book
  // Updating 3 : At last we save them in book.json

  save() {
    getBooksFromFile((books) => {
      if (this.id) {
        console.log(" This id exisit ");
        const exisitingBookIndex = books.findIndex(
          (item) => item.id === this.id
        );
        const updatedBooks = [...books];
        updatedBooks[exisitingBookIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedBooks), (err) =>
          console.log(err)
        );
      } else {
        this.id = Math.random().toString();
        books.push(this);
        fs.writeFile(p, JSON.stringify(books), (err) => console.log(err));
      }
    });

    // fs.readFile(p, (err, fileContent) => {
    //   let books = [];
    //   if (!err) {
    //     books = JSON.parse(fileContent);
    //   }
    //   books.push(this);
    //   fs.writeFile(p, JSON.stringify(books), (err) => console.log(err));
    // });
  }

  static deleteById(id) {
    getBooksFromFile((books) => {
      const book = books.find((item) => item.id === id);
      const updatedBook = books.filter((item) => item.id !== id);
      fs.writeFile(p, JSON.stringify(updatedBook), (err) => {
        //Delete item from cart too
        Cart.deleteBook(id, book.price);
      });
    });
  }

  static fetchAll(cb) {
    // fs.readFile(p, (err, fileContent) => {
    //   if (err) {
    //     cb([]);
    //   }
    //   cb(JSON.parse(fileContent));
    // });

    getBooksFromFile(cb);
  }

  static findById(id, cb) {
    getBooksFromFile((books) => {
      const book = books.find((item) => item.id === id);
      cb([book]);
    });
  }
};
