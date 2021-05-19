const {Sequelize} = require('sequelize');

module.exports = new Sequelize('gyenespaintball', 'root', 'Balint1999', {
    host: 'localhost',
    dialect: 'mysql'
});
