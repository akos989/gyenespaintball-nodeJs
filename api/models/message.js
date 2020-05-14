const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Message = db.model('Message', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, required: true },
    text: { type: String, required: true },
    replied: { type: Boolean, default: false }
});

module.exports = Message;