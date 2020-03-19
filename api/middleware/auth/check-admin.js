const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    if (req.userData.reservationId) {
        return next();
    }
    if (req.userData.operatorId == req.params.operatorId) {
        return next();
    }
    Operator.findById(req.userData.operatorId)
        .exec()
        .then( operator => {
            if (!operator) {
                return res.status(401).json({
                    error: {
                        error: 'AUTH_FAILED'
                    }
                });
            }
            if (!operator.admin) {
                return res.status(401).json({
                    error: {
                        error: 'NOT_ADMIN'
                    }
                });
            }
            res.locals.isAdmin = true;
            next();            
        })
        .catch(err => {
            return res.status(401).json({
                error: {
                    error: 'AUTH_FAILED',
                    message: err
                }
            });
        });
};