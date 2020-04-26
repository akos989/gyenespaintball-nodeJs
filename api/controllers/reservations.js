const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Reservation = require('../models/reservation');

exports.get_all = (req, res, next) => {
    Reservation.find()
        .populate('packageId')
        .exec()
        .then( reservations => {
            res.status(200).json({
                count: reservations.length,
                reservations: {
                    reservation: reservations.map(reservation => {
                        return {
                            _id: reservation._id,
                            name: reservation.name,
                            email: reservation.email,
                            phoneNumber: reservation.phoneNumber,
                            playerNumber: reservation.playerNumber,
                            notes: reservation.notes,
                            date: reservation.date,
                            package: reservation.packageId
                        }
                    })
                }                
            });
        } )
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
    const reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        playerNumber: req.body.playerNumber,
        notes: req.body.notes,
        date: req.body.date,
        packageId: req.body.packageId
    });
    console.log(reservation._id);
    reservation.save()
        .then(result => {
            res.locals.emailSubject = 'Új foglalás';
            res.locals.reservationInfo = result;           
            next();

            res.status(201).json({
                message: 'RESERVATION_CREATED',
                reservation: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    playerNumber: result.playerNumber,
                    notes: result.notes,
                    date: result.date,
                    packageId: result.packageId
                }                        
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'RESERVATION_CREATE_FAILED',
                    message: err
                }
            });
        });
};

exports.get_one = (req, res, next) => {
    Reservation.findById(req.params.reservationId)
        .populate('packageId')
        .exec()
        .then(reservation => {
            if (!reservation) {
                return res.status(404).json({
                    error: {
                        error: 'NO_RESERVATION_FOR_INDEX'
                    }
                });
            }
            res.status(200).json({
                message: 'RESERVATION_FOUND',
                reservation: {
                    _id: reservation._id,
                    name: reservation.name,
                    email: reservation.email,
                    phoneNumber: reservation.phoneNumber,
                    playerNumber: reservation.playerNumber,
                    notes: reservation.notes,
                    date: reservation.date,
                    package: reservation.packageId
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

exports.update = (req, res, next) => {
    Reservation.findById(req.params.reservationId)
        .exec()
        .then(original => {
            console.log(original);
            if (original) {
                original.name = req.body.name ? req.body.name : original.name;
                original.email = req.body.email ? req.body.email : original.email;
                original.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : original.phoneNumber;
                original.playerNumber = req.body.playerNumber ? req.body.playerNumber : original.playerNumber;
                original.notes = req.body.notes ? req.body.notes : original.notes;                
                original.packageId = req.body.packageId ? req.body.packageId : original.packageId; 
                original.date = req.body.date ? req.body.date : original.date;
                
                original.save()
                    .then(result => {
                        res.status(200).json({
                            message: 'RESERVATION_UPDATED',
                            reservation: {
                                _id: result._id,
                                name: result.name,
                                email: result.email,
                                phoneNumber: result.phoneNumber,
                                playerNumber: result.playerNumber,
                                notes: result.notes,
                                date: result.date,
                                package: result.packageId
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
            } else {
                res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
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

exports.delete = (req, res, next) => {
    Reservation.deleteOne({ _id: req.params.reservationId })
        .exec()
        .then(result => {
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