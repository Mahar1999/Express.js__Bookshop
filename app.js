const express = require("express");
const app = express();
const port = 3000;

// This should be on the top so that all imported paths can get access to .env variables
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");

const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const pageNotFoundRoutes = require("./controllers/error");
const sequelize = require("./util/database");
const book = require("./models/book");

//setting the ejs-view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true })); // expresss.parser
app.use(express.static(path.join(__dirname, "public"))); // public static files

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);

app.use(pageNotFoundRoutes.getPageNotFound);

sequelize
  .sync()
  .then((res) => {
    app.listen(port, () => {
      console.log(`Server is running successfully on port : ${port}`);
    });
  })
  .catch((err) => console.log(err));

  

// res.send() -  is for sending simple text and custom HTML

// res.sendFiles() -  is for sending static HTML pages
// res.status(404).sendFile(path.join(__dirname, "views", "pageNotFound.html"));

// res.render() -  is for sending Dynamic HTML pages
