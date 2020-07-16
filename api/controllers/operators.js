const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Operator = require('../models/operator');

exports.get_all = (req, res, next) => {
    Operator.find()
    .select("_id name email phoneNumber admin temporary accessLimit")
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
                    temporary: operator.temporary,
                    accessLimit: operator.accessLimit
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
};

exports.create = (req, res, next) => {
    Operator.find({email: req.body.email})
        .exec()
        .then(docs => {
            if (docs.length >= 1 && req.params.operatorId != docs[0]._id) {
                return res.status(409).json({
                    error: {
                        error: 'EMAIL_EXISTS'
                    }
                });
            } 
            if (req.body.password !== req.body.confirm) {
                return res.status(409).json({
                    error: {
                        error: 'PASS_NOT_MATCH'
                    }
                });
            }
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
                        name: req.body.name,
                        temporary: res.locals.temporary,
                        accessLimit: res.locals.accessLimit
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
                            
                            return next();
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
            if (operator.temporary && operator.accessLimit <= new Date()) {
                return res.status(500).json({
                    error: {
                        error: 'TEMP_OPERATOR_EXPIRED'
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
                        token: token,
                        email: operator.email,
                        expiresIn: '3600',
                        localId: operator._id,
                        newReservations: operator.newReservations
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

exports.update = (req, res, next) => {
    Operator.findById(req.params.operatorId )
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            operator.name = req.body.name ? req.body.name : operator.name;
            operator.email = req.body.email ? req.body.email : operator.email;
            operator.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : operator.phoneNumber;
            if (res.locals.hash) {
                operator.password = hash;
            }
            if (res.locals.isAdmin) {
                operator.admin = req.body.admin ? req.body.admin : operator.admin;
                operator.accessLimit = req.body.accessLimit ? req.body.accessLimit : operator.accessLimit;
                operator.temporary = req.body.temporary ? req.body.temporary : operator.temporary;
            }
            operator.save()
                .then(operator => {
                    if (operator._id != req.userData.operatorId) {
                        return res.status(200).json({
                            message: 'SUCCESSFUL_UPDATE',
                            _id: operator._id,
                            name: operator.name,
                            email: operator.email,
                            phoneNumber: operator.phoneNumber,
                            admin: operator.admin,
                            temporary: operator.temporary,
                            accessLimit: operator.accessLimit
                        });
                    }
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
                        message: 'SUCCESSFUL_UPDATE',
                        _id: operator._id,
                        name: operator.name,
                        email: operator.email,
                        phoneNumber: operator.phoneNumber,
                        admin: operator.admin,
                        temporary: operator.temporary,
                        accessLimit: operator.accessLimit,
                        token: token,
                        expiresIn: '3600'
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

exports.get_all_temporary = (req, res, next) => {
    Operator.find({ temporary: true })
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
                        temporary: operator.temporary,
                        accessLimit: operator.accessLimit
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
};

exports.get_my_account = (req, res, next) => {
    Operator.findById(req.userData.operatorId)
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(404).josn({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            res.status(200).json({
                operator: {
                    _id: operator._id,
                    name: operator.name,
                    email: operator.email,
                    phoneNumber: operator.phoneNumber,
                    admin: operator.admin,
                    temporary: operator.temporary,
                    accessLimit: operator.accessLimit,
                    newReservations: operator.newReservations
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
};
exports.new_reservation = (req, res, next) => {
    Operator.updateMany({ temporary: false }, { $push: { newReservations: res.locals.reservationInfo._id } })
        .exec()
        .then(result => {
            return next();
        })
        .catch(err => {
            return next();
        });
};
exports.delete_not_viewed = (req, res, next) => {
    Operator.updateMany(
        { temporary: false }, { $pull: { newReservations: { $in: req.body.ids } } }
    )
    .exec()
    .then(res => {
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
exports.view_reservation = (req, res, next) => {
    Operator.updateOne(
        { _id: req.body.operatorId }, { $pull: { newReservations: req.body.reservationId } }
        )
        .exec()
        .then(result => {
            return res.status(200).json({
                result: result
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
exports.getRefreshTokens = (next) => {
    Operator.find()
        .exec()
        .then(operators => {
            let refreshTokens = operators.map(o => {return o.googleCalendarToken}).filter(t => {return (t !== '')});            
            next(refreshTokens);
        })
        .catch(err => {
            next(refreshTokens);
        });
};
exports.set_token = (req, res, next) => {
    Operator.findById(req.body.operatorId)
        .exec()
        .then(operator => {
            if (!operator)
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            operator.googleCalendarToken = req.body.googletoken;
            operator.save()
                .then(result => {
                    return res.status(200).json({
                        message: 'OK',
                        operator: result
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        error: {
                            error: 'FAILED',
                            message: err
                        }
                    });
                });
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