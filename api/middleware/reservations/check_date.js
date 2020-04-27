const Reservation = require('../../models/reservation');

module.exports = (req, res, next) => {
    Reservation.find()
        .populate('packageId')
        .exec()
        .then( docs => {
            let intersectNum = 0;
            const reservation = res.locals.reservation;
            let playerNum = reservation.playerNumber;
            let startA = reservation.date.getHours();
            let endA = reservation.date.getHours() + res.locals.package.duration;
            for (const doc of docs) {
                let startB = doc.date.getHours();
                let endB = doc.date.getHours() + doc.packageId.duration;
                
                if (reservation.date.getFullYear() === doc.date.getFullYear() &&
                    reservation.date.getMonth() === doc.date.getMonth() &&
                    reservation.date.getDate() === doc.date.getDate()
                ) {
                    const min = (startA < startB ? [startA, endA] : [startB, endB]);
                    const max = ( (min[0] === startA && min[1] === endA) ? [startB, endB] : [startA, endA] );
                    if (!(min[1] <= max[0])) {
                        playerNum += doc.playerNum;
                        intersectNum++;
                    }
                }
            }
            if (intersectNum >= 2 || playerNum > 35 ) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_FULL'
                    }
                });
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

            if (reservation.date <= minDate) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_IS_BEFORE_MIN'
                    }
                });
            }

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