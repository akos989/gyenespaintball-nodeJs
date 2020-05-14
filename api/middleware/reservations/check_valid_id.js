const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    Reservation.findById(req.params.reservationId)
        .exec()
        .then(reservation => {
            if (!reservation) {
                return res.status(404).json({
                    error: {
                        error: 'RESERVATION_NOT_FOUND'
                    }
                });
            }
            res.locals.reservation = reservation;
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