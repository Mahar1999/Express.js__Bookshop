const fs = require("fs");
const path = require("path");

// get to rootFolder of project
const p = path.join(path.dirname(require.main.filename), "data", "books.json");

module.exports = class Book {
  constructor(title, price, author) {
    (this.title = title), (this.price = price), (this.author = author);
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let books = [];
      if (!err) {
        books = JSON.parse(fileContent);
      }
      books.push(this);
      fs.writeFile(p, JSON.stringify(books), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
