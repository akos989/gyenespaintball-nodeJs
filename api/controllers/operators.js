const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Operator = require('../models/operator');

exports.get_all = (req, res, next) => {
    Operator.find()
    .select("_id name email phoneNumber admin")
    .exec()
    .then(operators => {
        res.status(200).json({
            count: operators.length,
            operator: operators.map(operator => {
                return {
                    _id: operator._id,
                    name: operator.name,
                    email: operator.email,
                    phoneNumber: operator.phoneNumber,
                    admin: operator.admin,
                    request: {
                        type: 'GET',
                        url: process.env.host + '/operators/' + operator._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: {
                error: err
            }
        });
    });
};

exports.create = (req, res, next) => {
    Operator.find({email: req.body.email})
        .exec()
        .then(docs => {
            if (docs.length >= 1) {
                return res.status(409).json({
                    error: {
                        error: 'EMAIL_EXISTS'
                    }
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                error: 'HASH_FAILED',
                                message: err
                            }
                        });
                    } else {
                        const operator = new Operator({        
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            admin: res.locals.admin,
                            phoneNumber: req.body.phoneNumber,
                            name: req.body.name
                        });
                        operator.save()
                            .then(result => {
                                const token = jwt.sign(
                                    {
                                        operatorId: result._id,
                                        email: result.email
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: '1h'
                                    }
                                );
                                res.locals.operator = result;
                                res.locals.token = token;
                                
                                next();
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: {
                                        error: 'CREATION_FAILED',
                                        message: err
                                    }
                                });                    
                            }); 
                    }
                });    
            }
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

exports.login = (req, res, next) => {
    Operator.findOne({email: req.body.email})
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(401).json({
                    error: {
                        error: 'AUTH_FAILED'
                    }
                });
            }
            bcrypt.compare(req.body.password, operator.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: {
                            error: 'AUTH_FAILED'
                        }
                    }); 
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            operatorId: operator._id,
                            email: operator.email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );
                    return res.status(200).json({
                        message: 'AUTH_SUCCESSFUL',
                        token: token,
                        email: operator.email,
                        expiresIn: '3600',
                        localId: operator._id
                    });
                }
                res.status(401).json({
                    error: {
                        error: 'AUTH_FAILED'
                    }
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'AUTH_FAILED'
                }
            });
        });
};

exports.delete = (req, res, next) => {
    Operator.deleteOne({ _id: req.params.operatorId })
        .exec()
        .then(result => {
            res.status(200).json({
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