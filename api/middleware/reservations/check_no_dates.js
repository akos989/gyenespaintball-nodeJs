const NOD = require('../../models/not_open_date');

module.exports = (req, res, next) => {
    NOD.find()
        .exec()
        .then(noDates => {
            for (const nod of noDates) {
                if (nod.fromDate <= req.body.date && nod.toDate >= req.body.date) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_NOT_AVAILABLE'
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