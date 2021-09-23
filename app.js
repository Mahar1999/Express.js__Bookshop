const express = require("express");
const app = express();
const port = 3000;

// This should be on the top so that all imported paths can get access to .env variables
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Book = require("./models/book");
const User = require("./models/user");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const path = require("path");

const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const pageNotFoundRoutes = require("./controllers/error");

//setting the ejs-view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true })); // expresss.parser
app.use(express.static(path.join(__dirname, "public"))); // public static files

// defining above all middleware , so that it is passed in all below middleware
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);

app.use(pageNotFoundRoutes.getPageNotFound);

Book.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Book);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Book, { through: CartItem }); // one cart can hold multiple products
Book.belongsToMany(Cart, { through: CartItem }); // one book can be part of multiple carts

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Book, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Saket", email: "saketsingh1999@gmail.com" }); // created a temperory user entery
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart(); // created a temperory cart entry
  })
  .then((cart) => {
    app.listen(port, () => {
      console.log(`Server is running successfully on port : ${port}`);
    });
  })
  .catch((err) => console.log(err));

// res.send() -  is for sending simple text and custom HTML

// res.sendFiles() -  is for sending static HTML pages
// res.status(404).sendFile(path.join(__dirname, "views", "pageNotFound.html"));

// res.render() -  is for sending Dynamic HTML pages
