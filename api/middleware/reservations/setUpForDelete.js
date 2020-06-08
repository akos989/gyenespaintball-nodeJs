const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    Reservation.find().where('_id').in(req.body.ids)
        .populate('packageId')
        .exec()
        .then(reservations => {
            res.locals.moreReservations = true;
            res.locals.reservations = reservations;
            return next();
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILEedD',
                    message: err
                }
            });
        });
};