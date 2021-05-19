const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = Reservations = db.define('Reservations', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    playerNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    packageId: {
        type: DataTypes.NUMBER
    }
});
