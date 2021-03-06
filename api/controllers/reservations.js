const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Reservation = require('../models/reservation');

exports.get_all = (req, res, next) => {
    Reservation.find()
        .exec()
        .then( reservations => {
            res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
                        _id: reservation._id,
                        name: reservation.name,
                        email: reservation.email,
                        phoneNumber: reservation.phoneNumber,
                        playerNumber: reservation.playerNumber,
                        notes: reservation.notes,
                        date: reservation.date,
                        packageId: reservation.packageId,
                        archived: reservation.archived,
			            timeStamp: reservation._id.getTimestamp()
                    }
                })             
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

exports.get_all_client = (req, res, next) => {
    Reservation.find({archived: false})
        .exec()
        .then( reservations => {
            res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
			_id: reservation._id,
                        playerNumber: reservation.playerNumber,
                        date: reservation.date,
                        packageId: reservation.packageId
                    }
                })             
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
    const reservation = res.locals.reservation;
    reservation.save()
        .then(result => {
            res.locals.emailSubject = 'Paintball foglalás';
            res.locals.emailTitle = 'Köszönjük a foglalást!';
            res.locals.emailDetails = 'A foglalásról a foglalt időpont előtt 48 órával fog kapni egy emlékeztető emailt. Amennyiben lemondaná a foglalást kérjük 24 órával az időpont előtt jelezze.';
		    res.locals.reservationInfo = result;
            res.locals.calendarEvent = 'create';
            res.locals.adminEmail = true;
            next();
            res.status(201).json({
                reservation: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    playerNumber: result.playerNumber,
                    notes: result.notes,
                    date: result.date,
                    packageId: result.packageId,
                    archived: result.archived,
                    timeStamp: reservation._id.getTimestamp()
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

exports.update = (req, res, next) => {
   const reservation = res.locals.reservation;
   reservation.save()
    .then(result => {
        if (result.archived) {
            return res.status(200).json({
                reservation: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    playerNumber: result.playerNumber,
                    notes: result.notes,
                    date: result.date,
                    packageId: result.packageId,
                    archived: result.archived,
                    timeStamp: reservation._id.getTimestamp()
                }
            });
        } else {
            res.locals.emailSubject = 'Módosított foglalás';
            res.locals.emailTitle = 'Foglalási adatai módosítva lettek!';
            res.locals.emailDetails = 'A lenti foglalás adatai megváltoztak. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.';
            res.locals.reservationInfo = result;
            res.locals.adminEmail = false;
            res.locals.calendarEvent = 'update';
            next();
    
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
                    packageId: result.packageId,
                    archived: result.archived
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

exports.toggleArchived = (req, res, next) => {
    Reservation.where('_id').in(req.body.ids)
        .updateMany({$set: {archived: req.body.isArchived}})
        .exec()
        .then(result => {
            return res.status(200).json({
                result: result,
                message: 'updated'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'NOT_UPDATED_ARCHIVE',
                    message: err
                }
            });
        });
};

exports.delete = (req, res, next) => {
    Reservation.where('_id').in(req.body.ids)
        .deleteMany()
        .exec()
        .then(result => {
            res.locals.emailSubject = 'Törölt foglalás';
            res.locals.emailTitle = 'Foglalását törölték!';
            res.locals.emailDetails = 'A lenti foglalást törölték. Amennyiben erre nem számított mihamarabb vegye fel a kapcsolatot valamelyik munkatársunkkal.';
            res.locals.adminEmail = false;
            res.locals.calendarEvent = 'delete';
            next();
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

exports.get_for_month = (req, res, next) => {
    const date = new Date(req.body.date);
    const fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23);

    Reservation.find({ date: { $gte: fromDate, $lte: toDate } })
        .exec()
        .then(reservations => {
            return res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
                        playerNumber: reservation.playerNumber,
                        date: reservation.date,
                        packageId: reservation.packageId
                    }
                })
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
}

exports.notify_reservations = () => {
    const EmailController = require('./email');
    let tomorrowDate = new Date();
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
    let laterDate = new Date();
    laterDate.setUTCDate(laterDate.getUTCDate() + 2);
    Reservation.find({ date: { $gte: tomorrowDate, $lte: laterDate }, archived: false })
        .populate('packageId')
        .exec()
        .then(reservations => {
            reservations.forEach((reservation) => {
                const htmlBody = EmailController
                    .scheduled_email_content(reservation, reservation.packageId);
                EmailController.scheduled_email(
                    reservation.email, htmlBody, 'Foglalási emlékeztető'
                );
            });
        })
        .catch(err => {});
};

exports.autoArchiveReservations = () => {
    const EmailController = require('./email');
    let today = new Date();
    today.setUTCDate(today.getUTCDate());
    Reservation.find({ date: { $lte: today}, archived: false})
        .exec()
        .then(reservations => {
            reservations.forEach(reservation => {
                reservation.archived = true;
                reservation.save()
                    .then(result => {})
                    .catch(err => {});
                const htmlBody = EmailController
                    .thanks_email_content(reservation);
                EmailController.scheduled_email(
                    reservation.email, htmlBody, 'Köszönet'
                );
            });
        })
        .catch(err => {})
};