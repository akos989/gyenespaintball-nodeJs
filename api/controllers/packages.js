const Package = require('../models/package');

exports.get_all = (req, res, _) => {
    Package.findAll()
        .then(packages => {
            res.status(200).json({
                count: packages.length,
                packages: packages.map(pack => {
                    return {
                        _id: pack.id,
                        name: pack.name,
                        fromNumberLimit: pack.fromNumberLimit,
                        toNumberLimit: pack.toNumberLimit,
                        bulletPrice: pack.bulletPrice,
                        basePrice: pack.basePrice,
                        duration: pack.duration,
                        disabled: pack.disabled,
                        includedBullets: pack.includedBullets,
                        description: pack.description
                    }
                })
            });
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

exports.create = (req, res, next) => {
    Package.findOne({
        where: {name: req.body.name}
    })
        .then(result => {
            if (result) {
                return res.status(500).json({
                    error: {
                        error: 'NAME_EXISTS'
                    }
                });
            }
            const pack = Package.build({
                name: req.body.name,
                fromNumberLimit: req.body.fromNumberLimit,
                toNumberLimit: req.body.toNumberLimit,
                bulletPrice: req.body.bulletPrice,
                basePrice: req.body.basePrice,
                duration: req.body.duration,
                disabled: req.body.disabled,
                includedBullets: req.body.includedBullets,
                description: req.body.description
            });
            pack.save()
                .then(package => {
                    req.body.packageIdArray = [package.id];
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

exports.get_one = (req, res, next) => {
    Package.findByPk(req.params.packageId)
        .then(package => {
            if (!package) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            return res.status(200).json({
                _id: package.id,
                name: package.name,
                fromNumberLimit: package.fromNumberLimit,
                toNumberLimit: package.toNumberLimit,
                bulletPrice: package.bulletPrice,
                basePrice: package.basePrice,
                duration: package.duration,
                disabled: package.disabled,
                includedBullets: package.includedBullets,
                description: package.description
            });
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

exports.delete = (req, res, next) => {
    Package.destroy({
        where: {id: req.body.ids}
    })
        .then(() => {
            req.body.packageIdArray = req.body.ids;
            return next();
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'NOT_DELETED',
                    message: err
                }
            });
        });
};

exports.disable = (req, res, _) => {
    Package.update(
        {disabled: req.body.isDisabled},
        {where: {id: req.body.ids}}
    )
        .then(() => {
            return res.status(200).json({
                message: 'OK'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'NOT_UPDATED',
                    message: err
                }
            });
        });
};

exports.update = (req, res, next) => {
    Package.findByPk(req.params.packageId)
        .then(package => {
            if (!package) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            package.name = req.body.name ? req.body.name : package.name;
            package.fromNumberLimit = req.body.fromNumberLimit ? req.body.fromNumberLimit : package.fromNumberLimit;
            package.toNumberLimit = req.body.toNumberLimit ? req.body.toNumberLimit : package.toNumberLimit;
            package.bulletPrice = req.body.bulletPrice ? req.body.bulletPrice : package.bulletPrice;
            package.basePrice = req.body.basePrice ? req.body.basePrice : package.basePrice;
            package.duration = req.body.duration ? req.body.duration : package.duration;
            package.disabled = req.body.disabled != null ? req.body.disabled : package.disabled;
            package.includedBullets = req.body.includedBullets ? req.body.includedBullets : package.includedBullets;
            package.description = req.body.description ? req.body.description : package.description;

            package.save()
                .then(package => {
                    return res.status(200).json({
                        _id: package.id,
                        name: package.name,
                        fromNumberLimit: package.fromNumberLimit,
                        toNumberLimit: package.toNumberLimit,
                        bulletPrice: package.bulletPrice,
                        basePrice: package.basePrice,
                        duration: package.duration,
                        disabled: package.disabled,
                        includedBullets: package.includedBullets,
                        description: package.description
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: {
                            error: 'FAILED',
                            message: err
                        }
                    });
                });
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
