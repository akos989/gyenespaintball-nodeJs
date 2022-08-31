const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    if (req.params.reservationId) {
        Reservation.findByPk(req.params.reservationId)
            .then( original => {
                if (original) {
                    res.locals.original = original;
                    original.name = req.body.name ? req.body.name : original.name;
                    original.email = req.body.email ? req.body.email : original.email;
                    original.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : original.phoneNumber;
                    original.playerNumber = req.body.playerNumber ? req.body.playerNumber : original.playerNumber;
                    original.notes = req.body.notes ? req.body.notes : original.notes;                
                    original.date = req.body.date ? req.body.date : original.date;
                    original.archived = req.body.archived ? req.body.archived : original.archived;
                    
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
        res.locals.reservation = Reservation.build({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            playerNumber: req.body.playerNumber,
            notes: req.body.notes,
            date: req.body.date,
        });
        return next();
    }
};
