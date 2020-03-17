const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Operator = db.model('Operator', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { 
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
    },
    password: { type: String, required: true },
    phoneNumber: {type:String, required: true },
    admin: { type: Boolean, default: false }
});

module.exports = Operator;