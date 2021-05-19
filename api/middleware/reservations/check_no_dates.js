const NOD = require('../../models/not_open_date');

module.exports = (req, res, next) => {
    NOD.findAll()
        .then(noDates => {
            const reservation = res.locals.reservation;
            for (const nod of noDates) {
                if (nod.fromDate <= reservation.date && nod.toDate >= reservation.date) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_CLOSED'
                        }
                    });
                }
            }
            return next();
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'ERROR',
                    message: err
                }
            });
        });
};
