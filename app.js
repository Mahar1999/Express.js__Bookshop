const express = require("express")
const app = express()
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const fs = require("fs")

const port = 3000
const csrf = require("csurf")
const flash = require("connect-flash")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config()
const bcrypt = require("bcryptjs")
const multer = require("multer")

const session = require("express-session")
const sequelize = require("./util/database")
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const Cart = require("./models/cart")
const CartItem = require("./models/cart-item")
const Book = require("./models/book")
const User = require("./models/user")
const Order = require("./models/order")
const OrderItem = require("./models/order-item")

const authRoutes = require("./routes/auth")
const homeRoutes = require("./routes/home")
const adminRoutes = require("./routes/admin")
const pageNotFoundRoutes = require("./controllers/error")

app.use(helmet())
app.use(compression())

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
)
app.use(morgan("combined", { stream: accessLogStream }))

const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname) // : is not allowed in a windows file name
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.urlencoded({ extended: true }))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
)
app.use(express.static(path.join(__dirname, "public")))
app.use("/images", express.static(path.join(__dirname, "images")))

const sessionStore = new SequelizeStore({ db: sequelize })
app.use(
  session({
    secret: "my secret key ",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
)

app.use(csrfProtection)
app.use(flash()) // To be initalized after session is declared

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/admin", adminRoutes)
app.use("/", homeRoutes)
app.use(authRoutes)
app.use(pageNotFoundRoutes.getPageNotFound)

Book.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
User.hasMany(Book)

User.hasOne(Cart) // parent.hasOne(child)->parent(independent) is free , child depends on parent via foreign key
Cart.belongsTo(User) //child.belongsTo(parent) ->foregin key in child(dependent) , and reference key in parent(independent)

Cart.belongsToMany(Book, { through: CartItem })
Book.belongsToMany(Cart, { through: CartItem })

Order.belongsTo(User)
User.hasMany(Order)

Order.belongsToMany(Book, { through: OrderItem })

sequelize
  // .sync({ force: true })
  .sync()
  // .then((res) => {
  //   return User.findOne()
  // })
  // .then((user) => {
  //   if (!user) {
  //     return bcrypt.hash("saket", 12).then((hashPass) => {
  //       return User.create({
  //         email: "saketsingh1999@gmail.com",
  //         password: hashPass,
  //       })
  //     })
  //   }
  //   return user
  // })
  // .then((user) => {
  //   return user.createCart()
  // })
  .then((cart) => {
    app.listen(port, () => {
      console.log(`Server is running successfully on port : ${port}`)
    })
  })
  .catch((err) => console.log(err))
