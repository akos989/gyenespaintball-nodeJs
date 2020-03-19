const Schema = require('mongoose').Schema;
const db = require('../config/db');

const NotOpenDate = db.model('NotOpenDate', {
    _id: Schema.Types.ObjectId,
    reason: { type: String },
    fromDate: {
        type: Date,
        required: true,
        unique: true,
        min: Date.now()
    },
    toDate: {
        type: Date,
        required: true,
        min: Date.now()
    }
});

module.exports = NotOpenDate;