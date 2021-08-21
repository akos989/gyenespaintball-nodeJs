const Operators = require('../models/operator');
const Reservations = require('../models/reservation');
const Packages = require('../models/package');
const PackageTypes = require('../models/package-type');

exports.setUpAssociations = () => {
    Packages.hasMany(Reservations);
    Reservations.belongsTo(Packages)
    PackageTypes.hasMany(Packages);
    Operators.belongsToMany(Reservations, {through: 'New_Reservations', as: 'newReservations'});
    Reservations.belongsToMany(Operators, {through: 'New_Reservations'});
};
