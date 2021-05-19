const NOD = require('../../models/not_open_date');

module.exports = (req, res, next) => {
    if (req.params.nodId && (!req.body.fromDate && !req.body.toDate)) {
        return next();
    }
    const startA = new Date(req.body.fromDate).valueOf();
    const endA = new Date(req.body.toDate).valueOf();
    if (endA < startA)
        return res.status(500).json({
            error: {
                error: 'FROM_>_TO'
            }
        });
    NOD.findAll()
        .then(noDates => {
            for (const noDate of noDates) {
                const startB = noDate.fromDate.valueOf();
                const endB = noDate.toDate.valueOf();

                const min = (startA < startB ? [startA, endA] : [startB, endB]);
                const max = ((min[0] === startA && min[1] === endA) ? [startB, endB] : [startA, endA]);
                if (!(min[1] < max[0]) && noDate.id.toString() !== req.params.nodId) {
                    return res.status(500).json({
                        error: {
                            error: 'NO_DATE_OVERLAPS'
                        }
                    });
                }
            }
            return next();
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
