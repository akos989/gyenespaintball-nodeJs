const {Op} = require("sequelize");

const Reservation = require('../models/reservation');
const Packages = require('../models/package');
const ReservationEmail = require('../models/ReservationEmail');
const ReservationEmailTypes = require('../models/ReservationEmailTypes');

const getAdminPhoneNumbers = require('../middleware/operator/GetAdminPhoneNumbers');

const lodash = require('lodash');

exports.get_all = (req, res, next) => {
    Reservation.findAll({
        include: Packages
    })
        .then(reservations => {
            res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
                        _id: reservation.id,
                        name: reservation.name,
                        email: reservation.email,
                        phoneNumber: reservation.phoneNumber,
                        playerNumber: reservation.playerNumber,
                        notes: reservation.notes,
                        date: reservation.date,
                        packageId: reservation.Package.id,
                        archived: reservation.archived,
                        timeStamp: reservation.createdAt
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

exports.get_all_client = (req, res, next) => {
    Reservation.findAll({
        where: {archived: false},
        include: Packages
    })
        .then(reservations => {
            res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
                        _id: reservation.id,
                        playerNumber: reservation.playerNumber,
                        date: reservation.date,
                        packageId: reservation.Package.id
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
    const reservation = res.locals.reservation;
    reservation.save()
        .then(result => {
            result.setPackage(res.locals.package)
                .then(reservationWithPackage => {
                    const reservationEmailData = {
                        name: reservationWithPackage.name,
                        email: reservationWithPackage.email,
                        phoneNumber: reservationWithPackage.phoneNumber,
                        playerNumber: reservationWithPackage.playerNumber,
                        notes: reservationWithPackage.notes,
                        date: new Date(reservationWithPackage.date.getFullYear(), reservationWithPackage.date.getMonth(), reservationWithPackage.date.getDate(), reservationWithPackage.date.getUTCHours()),
                        package: {
                            bulletPrice: res.locals.package.bulletPrice,
                            duration: res.locals.package.duration,
                            basePrice: res.locals.package.basePrice,
                            includedBullets: res.locals.package.includedBullets
                        }
                    };

                    const reservationCreatedEmail = new ReservationEmail({
                        reservation: lodash.cloneDeep(reservationEmailData),
                        reservationEmailType: ReservationEmailTypes.Created,
                        receiver: reservationEmailData.email,
                        adminPhoneNumbers: res.locals.adminPhoneNumbers
                    });
                    const reservationAdminEmail = new ReservationEmail({
                        reservation: lodash.cloneDeep(reservationEmailData),
                        reservationEmailType: ReservationEmailTypes.Admin,
                        receiver: res.locals.adminEmails,
                        adminPhoneNumbers: res.locals.adminPhoneNumbers
                    });
                    reservationCreatedEmail.send();
                    reservationAdminEmail.send();

                    res.locals.reservationInfo = reservationWithPackage;
                    next();
                    res.status(201).json({
                        reservation: {
                            _id: reservationWithPackage.id,
                            name: reservationWithPackage.name,
                            email: reservationWithPackage.email,
                            phoneNumber: reservationWithPackage.phoneNumber,
                            playerNumber: reservationWithPackage.playerNumber,
                            notes: reservationWithPackage.notes,
                            date: reservationWithPackage.date,
                            packageId: req.body.packageId,
                            archived: reservationWithPackage.archived,
                            timeStamp: reservation.createdAt
                        }
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        error: {
                            error: 'RESERVATION_CREATE_FAILED',
                            message: error
                        }
                    });
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
            result.setPackage(res.locals.package)
                .then(reservationWithPackage => {
                    res.status(200).json({
                        message: 'RESERVATION_UPDATED',
                        reservation: {
                            _id: reservationWithPackage.id,
                            name: reservationWithPackage.name,
                            email: reservationWithPackage.email,
                            phoneNumber: reservationWithPackage.phoneNumber,
                            playerNumber: reservationWithPackage.playerNumber,
                            notes: reservationWithPackage.notes,
                            date: reservationWithPackage.date,
                            packageId: res.locals.package.id,
                            archived: reservationWithPackage.archived,
                            timeStamp: reservationWithPackage.createdAt
                        }
                    });
                    if (!reservationWithPackage.archived) {
                        const reservationEmailData = {
                            name: reservationWithPackage.name,
                            email: reservationWithPackage.email,
                            phoneNumber: reservationWithPackage.phoneNumber,
                            playerNumber: reservationWithPackage.playerNumber,
                            notes: reservationWithPackage.notes,
                            date: new Date(reservationWithPackage.date.getFullYear(), reservationWithPackage.date.getMonth(), reservationWithPackage.date.getDate(), reservationWithPackage.date.getUTCHours()),
                            package: {
                                bulletPrice: res.locals.package.bulletPrice,
                                duration: res.locals.package.duration,
                                basePrice: res.locals.package.basePrice,
                                includedBullets: res.locals.package.includedBullets
                            }
                        };

                        const reservationCreatedEmail = new ReservationEmail({
                            reservation: lodash.cloneDeep(reservationEmailData),
                            reservationEmailType: ReservationEmailTypes.Modified,
                            receiver: reservationEmailData.email,
                            adminPhoneNumbers: res.locals.adminPhoneNumbers
                        });
                        reservationCreatedEmail.send();
                    }
                })
                .catch(error => {
                    return res.status(500).json({
                        error: {
                            error: 'FAILED',
                            message: error
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

exports.toggleArchived = (req, res, _) => {
    Reservation.update(
        {archived: req.body.isArchived},
        {where: {id: req.body.ids}}
    )
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

exports.delete = (req, res, _) => {
    Reservation.destroy({
        where: {id: req.body.ids}
    })
        .then(() => {
            for (const reservation of res.locals.reservations) {
                if (!reservation.archived) {
                    const reservationEmailData = {
                        name: reservation.name,
                        email: reservation.email,
                        phoneNumber: reservation.phoneNumber,
                        playerNumber: reservation.playerNumber,
                        notes: reservation.notes,
                        date: new Date(reservation.date.getFullYear(), reservation.date.getMonth(), reservation.date.getDate(), reservation.date.getUTCHours()),
                        package: {
                            bulletPrice: reservation.Package.bulletPrice,
                            duration: reservation.Package.duration,
                            basePrice: reservation.Package.basePrice,
                            includedBullets: reservation.Package.includedBullets
                        }
                    };
                    const reservationEmail = new ReservationEmail({
                        reservation: reservationEmailData,
                        reservationEmailType: ReservationEmailTypes.Deleted,
                        receiver: reservationEmailData.email,
                        adminPhoneNumbers: res.locals.adminPhoneNumbers
                    });
                    reservationEmail.send();
                }
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

exports.get_for_month = (req, res, _) => {
    const today = new Date(req.body.date);
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23);

    Reservation.findAll({
        where: {
            date: {[Op.between]: [fromDate, toDate]}
        },
        include: Packages
    })
        .then(reservations => {
            return res.status(200).json({
                reservations: reservations.map(reservation => {
                    return {
                        playerNumber: reservation.playerNumber,
                        date: reservation.date,
                        packageId: reservation.Package.id
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

exports.notify_reservations = async () => {
    let tomorrowDate = new Date();
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 2);
    let laterDate = new Date();
    laterDate.setUTCDate(laterDate.getUTCDate() + 3);

    const reservations = await Reservation.findAll({
        where: {
            date: {[Op.between]: [tomorrowDate, laterDate]},
            archived: false
        },
        include: Packages
    });
    let adminPhoneNumbers = [];
    try {
       adminPhoneNumbers = await getAdminPhoneNumbers();
    } catch (e) {
        console.log(e);
    }

    for (const reservation of reservations) {
        const reservationEmailData = {
            name: reservation.name,
            email: reservation.email,
            phoneNumber: reservation.phoneNumber,
            playerNumber: reservation.playerNumber,
            notes: reservation.notes,
            date: new Date(reservation.date.getFullYear(), reservation.date.getMonth(), reservation.date.getDate(), reservation.date.getUTCHours()),
            package: {
                bulletPrice: reservation.Package.bulletPrice,
                duration: reservation.Package.duration,
                basePrice: reservation.Package.basePrice,
                includedBullets: reservation.Package.includedBullets
            }
        };

        const reservationCreatedEmail = new ReservationEmail({
            reservation: lodash.cloneDeep(reservationEmailData),
            reservationEmailType: ReservationEmailTypes.Scheduled,
            receiver: reservationEmailData.email,
            adminPhoneNumbers: adminPhoneNumbers
        });
        reservationCreatedEmail.send();
    }
};

exports.autoArchiveReservations = async () => {
    let today = new Date();
    today.setUTCDate(today.getUTCDate());

    try {
        const adminPhoneNumbers = await getAdminPhoneNumbers() ?? [];
        const reservations = await Reservation.findAll({
            where: {
                date: {[Op.lte]: today},
                archived: false
            }
        });
        for (const reservation of reservations) {
            reservation.archived = true;
            const result = await reservation.save();
            const reservationCreatedEmail = new ReservationEmail({
                reservation: {
                    name: result.name
                },
                reservationEmailType: ReservationEmailTypes.ThankYou,
                receiver: result.email,
                adminPhoneNumbers: adminPhoneNumbers
            });
            reservationCreatedEmail.send();
        }
    } catch (exception) {
        console.log(exception);
    }
};
