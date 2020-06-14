const Schema = require('mongoose').Schema;
const db = require('../config/db');

const NotOpenDate = db.model('NotOpenDate', {
    _id: Schema.Types.ObjectId,
    reason: { type: String },
    fromDate: {
        type: Date,
        required: true,
        unique: true
    },
    toDate: {
        type: Date,
        required: true
    }
});

module.exports = NotOpenDate;