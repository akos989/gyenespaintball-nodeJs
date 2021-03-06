const Operator = require('../../models/operator');

module.exports = (req, res, next) => {
    Operator.find({ admin: true })
        .exec()
        .then( operators => {
            const adminsEmails = [];
            for (const operator of operators) {
                adminsEmails.push(operator.email);
            }
            res.locals.adminEmails = adminsEmails;
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