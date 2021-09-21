const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("node_bookshop", "root", process.env.DB_PASS, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
