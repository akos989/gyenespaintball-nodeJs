const Schema = require('mongoose').Schema;
const db = require('../config/db');

const PackageType = db.model('PackageType', {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },    
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    sale: { type: Boolean, default: false }
});

module.exports = PackageType;