const Reservation = require('../../models/reservation');
const Packages = require('../../models/package');

module.exports = (req, res, next) => {
    Reservation.findAll({
        where: {id: req.body.ids},
        include: Packages
    })
        .then(reservations => {
            res.locals.moreReservations = true;
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
