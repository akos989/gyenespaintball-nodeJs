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
            const tOperator = new TempOperator({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                admin: req.body.admin
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