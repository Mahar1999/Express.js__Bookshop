const express = require("express");
const app = express();
const port = 3000;

const path = require("path");

const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const pageNotFoundRoutes = require("./controllers/error");

//setting the ejs-view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true })); // expresss.parser
app.use(express.static(path.join(__dirname, "public"))); // public static files

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);

app.use(pageNotFoundRoutes.getPageNotFound);

app.listen(port, () => {
  console.log(`Server is running successfully on port : ${port}`);
});

// res.send() -  is for sending simple text and custom HTML

// res.sendFiles() -  is for sending static HTML pages
// res.status(404).sendFile(path.join(__dirname, "views", "pageNotFound.html"));

// res.render() -  is for sending Dynamic HTML pages
