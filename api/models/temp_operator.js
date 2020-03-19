const Schema = require('mongoose').Schema;
const db = require('../config/db');

const TempOperator = db.model('TempOperator', {
    _id: Schema.Types.ObjectId,
    email: { 
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
    },
    admin: { type: Boolean, default: false },
    temporary: { type: Boolean, default: false },
    accessLimit: {
        type: Date,
        min: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() + 1,
                1
        )
    }
});

module.exports = TempOperator;