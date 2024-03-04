const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dukan', 'root', 'dj25082001', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;