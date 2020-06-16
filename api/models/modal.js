const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Modal = db.model('Modal', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, default: '' },
    modalImage: { type: String, default: '' },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true }
});

module.exports = Modal;
