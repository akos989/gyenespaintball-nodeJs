const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = NotOpenDates = db.define('NotOpenDates', {
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fromDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    toDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
});
