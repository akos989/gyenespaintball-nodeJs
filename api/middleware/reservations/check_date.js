const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    const date = new Date(req.body.date);
    console.log(date.getHours());
    date.setHours(date.getHours() + 2);
    req.body.date = date;
    console.log(req.body.date)

    Reservation.findOne({date: date})
        .exec()
        .then( doc => {
            if (doc) {
                if (req.params.reservationId != doc._id) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_EXISTS'
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
            res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });   
};