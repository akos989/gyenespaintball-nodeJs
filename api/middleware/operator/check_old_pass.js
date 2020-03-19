const Operator = require('../../models/operator');
const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
    if (!req.body.password) {
        return next();
    }

    Operator.findById( req.params.operatorId )
        .exec()
        .then(operator => {
            if (!operator) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            bcrypt.compare(req.body.oldPassword, operator.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: {
                            error: 'PASS_NOT_MATCH_OLD'
                        }
                    }); 
                }
                if (result) {
                    return next();
                }                   
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
}