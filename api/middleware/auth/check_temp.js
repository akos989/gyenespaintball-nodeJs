const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    if (req.userData.reservationId) {
        return next();
    }
    Operator.findById(req.userData.operatorId)
        .exec()
        .then(operator => {
            if (operator.temporary) {
                return res.status(500).json({
                    error: {
                        error: 'NO_TEMP_ACCESS'
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