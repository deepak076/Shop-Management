// Example Product model
const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  inventory: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0, 
  },
});

module.exports = Product;
