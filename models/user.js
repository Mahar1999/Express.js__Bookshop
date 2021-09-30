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
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiration: { type: DataTypes.STRING, allowNull: true },
})

module.exports = User
