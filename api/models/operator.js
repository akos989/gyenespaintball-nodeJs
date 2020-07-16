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
    },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    newReservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    googleCalendarToken: { type: String, default: '' }
});

module.exports = Operator;