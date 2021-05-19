const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = Message = db.define('Message', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    replied: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    reply: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
});
