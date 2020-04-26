const Reservation = require('../../models/reservation');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if (req.params.reservationId) {
        Reservation.findById(req.params.reservationId)
            .exec()
            .then( original => {
                if (original) {
                    original.name = req.body.name ? req.body.name : original.name;
                    original.email = req.body.email ? req.body.email : original.email;
                    original.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : original.phoneNumber;
                    original.playerNumber = req.body.playerNumber ? req.body.playerNumber : original.playerNumber;
                    original.notes = req.body.notes ? req.body.notes : original.notes;                
                    original.packageId = req.body.packageId ? req.body.packageId : original.packageId; 
                    original.date = req.body.date ? req.body.date : original.date;

                    res.locals.reservation = original;
                    return next();
                }
                return res.status(404).json({
                    error: {
                        error: 'NO_RESERVATION'
                    }
                });
            } )
            .catch(err => {
                return res.status(500).json({
                    error: {
                        error: 'ERROR',
                        message: err
                    }
                });
            });
    } else {
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
        res.locals.reservation = reservation;
        return next();
    }
   
};