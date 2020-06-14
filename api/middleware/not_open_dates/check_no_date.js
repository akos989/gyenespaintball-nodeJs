const NOD = require('../../models/not_open_date');

module.exports = (req, res, next) => {
    if (req.params.nodId && (!req.body.fromDate && !req.body.toDate)) {
        return next();
    }
    const startA = new Date(req.body.fromDate).valueOf();
    const endA = new Date(req.body.toDate).valueOf();
    NOD.find()
        .exec()
        .then(noDates => {
            if (endA < startA)
                return res.status(500).json({
                    error: {
                        error: 'FROM_>_TO'
                    }
                });
            for( const noDate of noDates ) {
                const startB = noDate.fromDate.valueOf();
                const endB = noDate.toDate.valueOf();

                const min = (startA < startB ? [startA, endA] : [startB, endB]);
                const max = ( (min[0] === startA && min[1] === endA) ? [startB, endB] : [startA, endA] );
                if (!(min[1] < max[0]) && !noDate._id.equals(req.params.nodId)) {
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



    // NOD.findOne({fromDate: req.body.fromDate})
    //     .exec()
    //     .then( doc => {
    //         if (doc) {
    //             if (!doc._id.equals(req.params.nodId)) {
    //                 return res.status(500).json({
    //                     error: {
    //                         error: 'DATE_EXISTS'
    //                     }
    //                 });
    //             }                
    //         }
            
    //         if (req.body.fromDate <= new Date()) {
    //             return res.status(500).json({
    //                 error: {
    //                     error: 'DATE_IS_BEFORE_MIN'
    //                 }
    //             });
    //         }
    //         if (req.body.fromDate > req.body.toDate) {
    //             return res.status(500).json({
    //                 error: {
    //                     error: 'FROM_>_TO'
    //                 }
    //             });
    //         }

    //         return next();
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             error: {
    //                 error: 'FAILED',
    //                 message: err
    //             }
    //         });
    //     });   
};