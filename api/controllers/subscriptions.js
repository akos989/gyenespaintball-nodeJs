const Operator = require('../models/operator');

exports.get_all = (req, res, next) => {
    Operator.find()
        .populate('subscriptions')
        .exec()
        .then(operators => {
            res.status(200).json({
                operators: operators.map(operator => {
                    return {
                        _id: operator._id,
                        name: operator.name,
                        subscriptions: operator.subscriptions
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
}

exports.subscribe = (req, res, next) => {
    res.locals.operator.subscriptions.push(req.params.reservationId);
    res.locals.operator.save()
        .then(result => {
            res.status(201).json({
                operator: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    subscriptions: result.subscriptions
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });       
}

exports.delete = (req, res, next) => {
    const id = req.body.operatorId ? req.body.operatorId : req.userData.operatorId;
    Operator.findById( id )
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
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
            return res.status(200).json({
                message: 'DELETE_SUCCESFUL'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'NOT_DELETED',
                    message: err
                }
            });
        });
};

exports.my_subs = (req, res, next) => {
    Operator.findById( req.userData.operatorId )
        .exec()
        .then(operator => {
            if (!operator) {
                res.status(404).json({
                    error: {
                        error: 'NOT_FOUND',
                        message: err
                    }
                });
            }
            res.status(200).json({
                _id: operator._id,
                subscriptions: operator.subscriptions
            });
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