const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = TempOperators = db.define('TempOperators', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    temporary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    accessLimit: {
        type: DataTypes.DATE
    }
});
