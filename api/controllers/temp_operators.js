const mongoose = require('mongoose');

const TempOperator = require('../models/temp_operator');

exports.create = (req, res, next) => {
    TempOperator.findOne({email: req.body.email})
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(409).json({
                    error: {
                        error: 'EMAIL_EXISTS'
                    }
                });
            }
            if (req.body.accessLimit) {
                const date = new Date(req.body.accessLimit);
                date.setHours(date.getHours() + 2);
                req.body.accessLimit = date;
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
            
            if (req.body.accessLimit <= minDate) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_IS_BEFORE_MIN'
                    }
                });
            }
            
            const tOperator = new TempOperator({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                admin: req.body.admin,
                temporary: req.body.temporary,
                accessLimit: req.body.accessLimit
            });
            tOperator.save()
                .then(result => {
                    //SEND EMAIL
                    res.status(201).json({
                        message: 'TEMP_OPERATOR_CREATED',
                        email: result.email,
                        result: result //to be deleted                                     
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: {
                            error: 'CREATION_FAILED',
                            message: err
                        }
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'CREATION_FAILED',
                    message: err
                }
            });
        });
};

exports.can_validate = (req, res, next) => {
    //params.operatorId
    TempOperator.findById(req.params.operatorId)
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(500).json({
                    error: {
                        error: 'NO_ID_TO_VALIDATE'
                    }
                });
            }
            if (operator.temporary && operator.accessLimit <= new Date()) {
                return res.status(500).json({
                    error: {
                        error: 'TEMP_OPERATOR_EXPIRED'
                    }
                }); 
            }
            res.status(200).json({
                message: 'READY_TO_VALIDATE',
                operatorId: operator._id,
                email: operator.email
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'VALIDATION_FAILED',
                    message: err
                }
            });
        });
};

exports.validate = (req, res, next) => {
    TempOperator.findById(req.params.temp_operatorId)
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    error: {
                        error: 'NO_ID_TO_VALIDATE'
                    }
                });
            }
            res.locals.admin = doc.admin;
            if (!doc.admin && doc.temporary) {
                res.locals.temporary = doc.temporary;
                res.locals.accessLimit = doc.accessLimit;
            }
            next();
        })
        .catch(err => {
            res.status(404).json({
                error: {
                    error: 'NO_ID_TO_VALIDATE',
                    message: err
                }
            });
        });
};

exports.delete_validated = (req, res, next) => {
    TempOperator.deleteOne({ _id: req.params.temp_operatorId })
        .exec()
        .then(result => {
            res.status(201).json({
                message: 'OPERATOR_CREATED',
                token: res.locals.token,
                email: res.locals.operator.email,
                expiresIn: '3600',
                localId: res.locals.operator._id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'OPERATOR_CREATED',
                token: res.locals.token,
                email: res.locals.operator.email,
                expiresIn: '3600',
                localId: res.locals.operator._id,

                error: {
                    error: 'TEMP_NOT_DELETED',
                    message: err
                }
            });
        });

};