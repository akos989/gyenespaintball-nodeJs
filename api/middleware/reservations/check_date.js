const Reservation = require('../../models/reservation');
const Packages = require('../../models/package');

module.exports = (req, res, next) => {
    if (!req.body.date)
        return next();
    if (res.locals.reservation.date < new Date()) {
        return res.status(500).json({
            error: {
                error: 'BEFORE_MIN'
            }
        });
    }
    Reservation.findAll({
        include: Packages,
        where: {archived: false}
    })
        .then(docs => {
            let intersectNum = 0;
            const reservation = res.locals.reservation;
            let playerNum = reservation.playerNumber;
            let startA = reservation.date.getHours();
            let endA = reservation.date.getHours() + res.locals.package.duration;
            for (const doc of docs) {
                let startB = doc.date.getHours();
                let endB = doc.date.getHours() + doc.Package.duration;
                if (reservation.date.getFullYear() === doc.date.getFullYear() &&
                    reservation.date.getMonth() === doc.date.getMonth() &&
                    reservation.date.getDate() === doc.date.getDate()
                ) {
                    console.log(reservation.name)
                    const min = (startA < startB ? [startA, endA] : [startB, endB]);
                    const max = ((min[0] === startA && min[1] === endA) ? [startB, endB] : [startA, endA]);
                    if (!(min[1] <= max[0]) && doc.id !== reservation.id) {
                        playerNum += doc.playerNumber;
                        intersectNum++;
                    }
                }
            }
            if (intersectNum >= 2 || playerNum > 35) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_FULL'
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
