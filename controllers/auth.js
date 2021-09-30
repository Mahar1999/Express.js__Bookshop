const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const sgMail = require("@sendgrid/mail")
const { Sequelize } = require("sequelize")
const Op = Sequelize.Op

const User = require("../models/user")

sgMail.setApiKey(process.env.SG_API)

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
    // advance auth : token generation for forget password rest link
    const token = buffer.toString("hex")

    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account with that email found !!!")
          res.redirect("/reset")
        }

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 360000
        return user.save()
      })
      .then((result) => {
        res.redirect("/")
        const message = {
          to: email,
          from: "saketsingh1999@gmail.com",
          subject: "Node Bookshop says hello",
          text: "This mailing system is working",
          html: `<p> You requested a password  reset </p>
                <p> Click this <a href="http://localhost:3000/reset/${token}"> link </a> to set new password.        
          `,
        }
        sgMail
          .send(message)
          .then(() => console.log(`Link Sent To Mail !!! successfully `))
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({
    where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
  })
    .then((user) => {
      res.render("auth/new-password", {
        pageTitle: "Update your password",
        path: "new-password",
        errorMessage: req.flash("error"),
        userId: user.id.toString(),
        token: token,
      })
    })
    .catch((err) => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const confirmNewPassword = req.body.confirmPassword
  const userId = req.body.userId
  const passwordToken = req.body.token
  let resetUser

  if (newPassword !== confirmNewPassword) {
    req.flash("error", "password and confirm password dont match")
    res.redirect("/reset")
  }

  console.log(newPassword, confirmNewPassword, userId, passwordToken)

  User.findOne({
    where: {
      resetToken: passwordToken,
      resetTokenExpiration: { [Op.gt]: Date.now() },
      id: userId,
    },
  })
    .then((user) => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then((hasPass) => {
      resetUser.password = hasPass
      resetUser.resetToken = null
      resetUser.resetTokenExpiration = null
      return resetUser.save()
    })
    .then(() => {
      res.redirect("/login")
    })
    .catch((err) => console.log(err))
}
