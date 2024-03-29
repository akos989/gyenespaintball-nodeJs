const Modal = require('../../models/modal');

module.exports = (req, res, next) => {
    if (!(req.body.fromDate && req.body.toDate))  {
        return res.status(500).json({
            error: {
                error: 'DATE_NOT_GIVEN'
            }
        });
    }
    const startA = new Date(req.body.fromDate);
    const endA = new Date(req.body.toDate);
    if (endA < startA)
        return res.status(500).json({
            error: {
                error: 'FROM_>_TO'
            }
        });
    Modal.findAll()
        .then( modals => {
            for(let modal of modals) {
                const startB = modal.fromDate.valueOf();
                const endB = modal.toDate.valueOf();

                const min = (startA < startB ? [startA, endA] : [startB, endB]);
                const max = ( (min[0] === startA && min[1] === endA) ? [startB, endB] : [startA, endA] );
                if (!(min[1] < max[0]) && modal.id.toString() !== req.params.modalId) {
                    return res.status(500).json({
                        error: {
                            error: 'DATE_OVERLAPS'
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
