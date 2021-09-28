const bcrypt = require("bcryptjs")
const User = require("../models/user")

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      return res.redirect("/signup")
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true
          req.session.user = user

          return req.session.save((err) => {
            console.log(err)
            res.redirect("/")
          })
        }
        res.redirect("/login")
      })
      .catch((err) => {
        console.log(err)
        res.redirect("/login")
      })
  })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect("/login")
  })
}

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up Form",
    path: "/signup",
  })
}

exports.postSignUp = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  //find user by the email
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return bcrypt.hash(password, 12).then((hashPass) => {
          return User.create({ email: email, password: hashPass })
        })
      }
      return user
    })
    .then((user) => {
      user.createCart()
      res.redirect("/")
    })
    .catch((err) => console.log(err))

  console.log(email, password, confirmPassword)
}
