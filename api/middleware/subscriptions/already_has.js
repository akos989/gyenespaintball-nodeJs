const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    const id = req.body.operatorId ? req.body.operatorId : req.userData.operatorId;
    Operator.findById(id)
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(404).json({
                    error: {
                        error: 'OPERATOR_NOT_FOUND'
                    }
                });
            }
            if (operator.subscriptions.includes(req.params.reservationId)) {
                return res.status(404).json({
                    error: {
                        error: 'ALREADY_SUBSCRIBED'
                    }
                });
            }
            res.locals.operator = operator;
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