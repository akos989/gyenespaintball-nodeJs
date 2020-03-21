const NOD = require('../../models/not_open_date');

module.exports = (req, res, next) => {
    let date = new Date(req.body.fromDate);
    req.body.fromDate = date;
    date = new Date(req.body.toDate);
    req.body.toDate = date;

    NOD.findOne({fromDate: req.body.fromDate})
        .exec()
        .then( doc => {
            if (doc) {
                if (req.params.nodId != doc._id) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_EXISTS'
                        }
                    });
                }                
            }
            
            if (req.body.fromDate <= new Date()) {
                return res.status(500).json({
                    error: {
                        error: 'DATE_IS_BEFORE_MIN'
                    }
                });
            }
            if (req.body.fromDate > req.body.toDate) {
                return res.status(500).json({
                    error: {
                        error: 'FROM_>_TO'
                    }
                });
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