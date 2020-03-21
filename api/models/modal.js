const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Modal = db.model('Modal', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String },
    modalImage: { type: String, required: true },
    fromDate: { type: Date },
    toDate: { type: Date, min: new Date() }
});

module.exports = Modal;