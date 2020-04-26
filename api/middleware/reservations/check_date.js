const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    if (req.params.reservationId) {
        if (!req.body.date) {
            return next();
        }
    }
    const date = new Date(req.body.date);
    req.body.date = date;

    Reservation.find({date: date})
        .exec()
        .then( docs => {
            if (docs.length >= 2) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_FULL'
                    }
                });
            }
            if (docs.length == 1) {
                if ( ((+docs[0].playerNumber) + (+req.body.playerNumber)) >= 33 ) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_FULL'
                        }
                    });
                }
            }

            let addition = 1;
            if (new Date().getUTCHours === 23) {
                addition = 2;
            }
            const minDate = new Date(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth(),
                    new Date().getUTCDate() + addition,
                    1
            );
            
            if (date <= minDate) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_IS_BEFORE_MIN'
                    }
                });
            }

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