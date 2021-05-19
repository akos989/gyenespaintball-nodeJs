const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = Operators = db.define('Operators', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
//newReservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }]
