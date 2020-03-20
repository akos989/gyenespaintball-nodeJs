const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Package = db.model('Package', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    fromNumberLimit: {type: Number, required: true, min: 0},
    toNumberLimit: {type: Number, required: true, min: 0},
    bulletPrice: {type: Number, required: true, min: 0},
    basePrice: {type: Number, required: true, min: 0},
    duration: { type: Number, default: 2, min: 0},
    sale: {type: Boolean, default: false},
    includedBullets: {type: Number}
});

module.exports = Package;