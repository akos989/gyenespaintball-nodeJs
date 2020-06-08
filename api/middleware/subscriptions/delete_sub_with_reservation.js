const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    Operator.find()
        .exec()
        .then(operators => {
            for(const operator of operators) {
                if (operator.subscriptions.includes(req.params.reservationId)) {
                    const i = operator.subscriptions.indexOf(req.params.reservationId);
                    operator.subscriptions.splice(i, 1);
                    operator.save()
                        .then()
                        .catch(err => {
                            return res.status(500).json({
                                error: {
                                    error: 'FAILED',
                                    message: err
                                }
                            });
                        });
                }
            }
            return next();
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILEDhere',
                    message: err
                }
            });
        });
};