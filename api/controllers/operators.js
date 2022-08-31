const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Operator = require('../models/operator');
const Reservations = require('../models/reservation');

exports.get_all = (req, res, _) => {
    Operator.findAll()
        .then(operators => {
            res.status(200).json({
                count: operators.length,
                operator: operators.map(operator => {
                    return {
                        _id: operator.id,
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
    Operator.findOne({
        where: {email: req.body.email}
    })
        .then(doc => {
            if (doc) {
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
                    const operator = Operator.build({
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
                                    operatorId: result.id,
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

exports.login = (req, res, _) => {
    Operator.findOne({
        where: {email: req.body.email},
        include: 'newReservations'
    })
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
                            operatorId: operator.id,
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
                        localId: operator.id,
                        newReservations: operator.newReservations.map(r => r.id)
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

exports.delete = (req, res, _) => {
    Operator.destroy({
        where: {id: req.params.operatorId}
    })
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
    Operator.findByPk(req.params.operatorId)
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
                operator.password = res.locals.hash;
            }
            if (res.locals.isAdmin) {
                operator.admin = req.body.admin ? req.body.admin : operator.admin;
                operator.accessLimit = req.body.accessLimit ? req.body.accessLimit : operator.accessLimit;
                operator.temporary = req.body.temporary ? req.body.temporary : operator.temporary;
            }
            operator.save()
                .then(operator => {
                    if (operator.id !== req.userData.operatorId) {
                        return res.status(200).json({
                            message: 'SUCCESSFUL_UPDATE',
                            _id: operator.id,
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
                            operatorId: operator.id,
                            email: operator.email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );
                    return res.status(200).json({
                        message: 'SUCCESSFUL_UPDATE',
                        _id: operator.id,
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

exports.get_all_temporary = (req, res, _) => {
    Operator.findAll({
        where: {temporary: true}
    })
        .then(operators => {
            res.status(200).json({
                count: operators.length,
                operator: operators.map(operator => {
                    return {
                        _id: operator.id,
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

exports.get_my_account = (req, res, _) => {
    Operator.findByPk(req.userData.operatorId, {
        include: 'newReservations'
    })
        .then(operator => {
            if (!operator) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            res.status(200).json({
                operator: {
                    _id: operator.id,
                    name: operator.name,
                    email: operator.email,
                    phoneNumber: operator.phoneNumber,
                    admin: operator.admin,
                    temporary: operator.temporary,
                    accessLimit: operator.accessLimit,
                    newReservations: operator.newReservations.map(r => r.id)
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
    Operator.findAll({
        where: {temporary: false},
        include: {
            model: Reservations,
            as: 'newReservations'
        }
    })
        .then(operators => {
            operators.forEach(o => {
                o.addNewReservation(res.locals.reservationInfo)
                    .then(_ => {})
                    .catch(err => console.log(err));
            });
        })
        .catch(err => {
            console.log(err)
        });
};
exports.view_reservation = (req, res, _) => {
    Operator.findByPk(req.params.operatorId)
        .then(operator => {
            operator.removeNewReservation(res.locals.reservation)
                .then(o => {
                    return res.status(200).json({
                        result: o
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        error: {
                            error: 'FAILED',
                            message: err
                        }
                    });
                })
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
