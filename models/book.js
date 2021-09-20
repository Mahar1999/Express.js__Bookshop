const Cart = require("../models/cart");
const db = require("../util/database");

module.exports = class Book {
  constructor(title, price, author, imageUrl, id) {
    (this.title = title),
      (this.price = price),
      (this.author = author),
      (this.imageUrl = imageUrl),
      (this.id = id);
  }

  save() {
    return db.execute(
      "INSERT INTO node_bookshop.books (title,price,author,imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.author, this.imageUrl]
    );
  }

  static deleteById(id) {}

  static fetchAll(cb) {
    return db
      .execute("SELECT * from node_bookshop.books")
      .then()
      .catch((err) => console.log(err));
  }

  static findById(id) {
    return db.execute("SELECT * from node_bookshop.books Where books.id = ?", [id]);
  }
};
