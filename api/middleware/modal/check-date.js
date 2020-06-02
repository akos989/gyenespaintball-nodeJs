const Modal = require('../../models/modal');

module.exports = (req, res, next) => {
    if ((!req.body.fromDate && req.body.toDate) || (req.body.fromDate && !req.body.toDate) )  {
        return res.status(500).json({
            error: {
                error: 'DATE_NOT_GIVEN'
            }
        });
    }
    if (!req.body.fromDate) {
        return next();
    }
    Modal.find()
        .exec()
        .then( modals => {            
            for(modal of modals) {
                if (
                    ((modal.fromDate <= new Date(req.body.fromDate) && new Date(req.body.fromDate) < modal.toDate)) ||
                    ((modal.toDate > new Date(req.body.toDate) && new Date(req.body.fromDate) >= modal.fromDate)) ||
                    ((modal.fromDate >= new Date(req.body.fromDate) && new Date(req.body.toDate) >= modal.toDate))
                )
                if (!modal._id.equals(req.params.modalId))
                    return res.status(500).json({
                        error: {
                            error: 'DATE_OVERLAPS'
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