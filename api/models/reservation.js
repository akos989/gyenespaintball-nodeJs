const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Reservation = db.model('Reservation', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { 
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
    },
    phoneNumber: {type:String, required: true },
    playerNumber: {type:Number, required: true },
    notes: { type:String },
    date: {
        type: Date,
        required: true,
        unique: false,
        min: new Date()
    },
    packageId: { type: Schema.Types.ObjectId, required: true, ref: 'Package' },
    archived: { type: Boolean, default: false }
});

module.exports = Reservation;