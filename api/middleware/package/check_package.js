const Package = require('../../models/package');

module.exports = (req, res, next) => {
    Package.findById( req.body.packageId )
        .exec()
        .then(package => {
            if (!package) {
                return res.status(500).json({
                    error: {
                        error: 'NO_PACKAGE'
                    }
                });
            }
           
            if (package.fromNumberLimit <= req.body.playerNumber &&
                req.body.playerNumber <= package.toNumberLimit) {
                    return next();
                }
            return res.status(500).json({
                error: {
                    error: 'NOT_GOOD_PACKAGE'
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
        })
};