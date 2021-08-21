const Package = require('../../models/package');

module.exports = (req, res, next) => {
    Package.findByPk(req.body.packageId)
        .then(package => {
            if (package) {
                res.locals.package = package;
                return next();
            }
            return res.status(404).json({
                error: {
                    error: 'NO_PACKAGE'
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'ERROR',
                    message: err
                }
            });
        });
};
