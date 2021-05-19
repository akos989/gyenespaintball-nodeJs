const {DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = Packages = db.define('Packages', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fromNumberLimit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    toNumberLimit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bulletPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    basePrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    includedBullets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ''
    },

});
