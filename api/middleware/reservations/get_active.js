const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    Reservation.findAll({
        where: {archived: false},
        include: 'Packages'
    })
        .then(reservations => {
            res.locals.reservations = reservations;
            return next();
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
};
