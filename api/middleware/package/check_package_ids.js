const Package = require('../../models/package');

module.exports = (req, res, next) => {

    for (const packageId of req.body.packageIdArray) {
        Package.findById( packageId )
            .exec()
            .then(package => {
                if (!package) {
                    return res.status(500).json({
                        error: {
                            error: 'NO_PACKAGE'
                        }
                    });
                }
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
    return next();
};