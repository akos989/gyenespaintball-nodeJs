const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = Modal = db.define('Modal', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    modalImage: {
        type: DataTypes.STRING,
        defaultValue: ''
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
