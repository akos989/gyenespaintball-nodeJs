const {Sequelize} = require('sequelize');

// module.exports = new Sequelize('gyenespaintball', 'akos989', 'Balint1999', {
//     host: '185.112.159.21',
//     dialect: 'mysql'
// });
module.exports = new Sequelize('gyenespaintball', 'root', 'Balint1999', {
    host: 'localhost',
    dialect: 'mysql'
});
