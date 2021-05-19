const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    if (!req.body.email) {
        return next();
    }
    Operator.findOne({
        where: {email: req.body.email}
    })
        .then( operator => {
            if (operator && operator.email !== req.userData.email) {
                return res.status(500).json({
                    error: {
                        error: 'EMAIL_EXISTS'
                    }
                });
            }
            return next();
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'NOT_FOUND',
                    message: err
                }
            });
        });
};
