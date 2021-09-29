const { Sequelize, DataTypes } = require("sequelize")

const sequelize = require("../util/database")

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resetToken: DataTypes.STRING,
  resetTokenExpiration: DataTypes.DATE,
})

module.exports = User
