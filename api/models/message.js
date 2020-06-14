const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Message = db.model('Message', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, required: true },
    text: { type: String, required: true },
    replied: { type: String, default: '' },
    reply: { type: String, default: '' }
});

module.exports = Message;
