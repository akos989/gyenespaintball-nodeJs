const {Sequelize} = require('sequelize');

module.exports = new Sequelize('gyenespaintball', 'root', 'Balint1999', {
    host: 'localhost',
    dialect: 'mysql'
});

// module.exports = new Sequelize('hwpuigic_gyenespaintball_db', 'hwpuigic_akos', 'Gyenes1230', {
//     host: 'localhost',
//     dialect: 'mysql'
// });
