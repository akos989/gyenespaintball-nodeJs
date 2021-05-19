const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = PackageTypes = db.define('PackageTypes', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
