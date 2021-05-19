const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    Reservation.findByPk(req.body.reservationId)
        .then(reservation => {
            if (reservation) {
                res.locals.reservation = reservation;
                return next();
            }
            return res.status(404).json({
                error: {
                    error: 'NOT_FOUND',
                    message: err
                }
            });
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
