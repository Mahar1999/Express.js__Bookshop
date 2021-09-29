const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const sgMail = require('@sendgrid/mail')

const User = require("../models/user")

sgMail.setApiKey(process.env.SG_API)

const message = { 
  to:"saketsingh2017@gmail.com",
  from:'saketsingh1999@gmail.com',
  subject:"Node Bookshop says hello",
  text: 'This mailing system is working',
  html:'<h1>This is a heading </h1>'
}

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: req.flash("error"),
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password")
      return res.redirect("/login")
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

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Page",
    path: "/login",
    errorMessage: req.flash("error"),
  })
}

exports.postReset = (req, res, next) => {
  const email = req.body.email

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect("/reset")
    }
    const token = buffer.toString("hex")

    User.findOne({ where: { email: email } })
      .then(user =>{
        if(!user){
          req.flash('error',"No Account with that email found !!!")
          res.redirect('/reset')
        }

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 360000
      })
      .catch((err) => console.log(err))
  })
}
