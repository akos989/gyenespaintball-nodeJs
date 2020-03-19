const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
    if (!req.body.password) {
        return next();
    }

    if (req.body.password !== req.body.confirm) {
        return res.status(500).json({
            error: {
                error: 'PASS_NOT_MATCH'
            }
        });
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: {
                    error: 'HASH_FAILED',
                    message: err
                }
            });
        }
        res.locals.hash = hash;
        return next();
    })
}