const PackageType = require('../models/package-type');
const Packages = require('../models/package');

exports.get_all = (req, res, _) => {
    PackageType.findAll({
    include: Packages
    })
        .then(packageTypes => {
            res.status(200).json({
                types: packageTypes.map(packageType => {
                    return {
                        id: packageType.id,
                        name: packageType.name,
                        sale: packageType.sale,
                        packages: packageType.Packages
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

exports.create = (req, res, _) => {
    PackageType.findOne({
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
            const packageType = PackageType.build({
                name: req.body.name,
                sale: req.body.sale
            });
            packageType.save()
                .then(packageType => {
                    res.status(201).json({
                        _id: packageType.id,
                        name: packageType.name,
                        sale: packageType.sale,
                        packages: []
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

exports.delete = (req, res, _) => {
    PackageType.destroy({
        where: {id: req.params.packageTypeId}
    })
        .then(() => {
            res.status(200).json({
                message: 'DELETE_SUCCESFUL'
            });
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
exports.typeExists = (req, res, next) => {
    PackageType.findByPk(req.body.packageTypeId)
        .then(type => {
            if (!type) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                })
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

exports.update = (req, res, _) => {
    PackageType.findByPk(req.params.packageTypeId, {
        include: 'Packages'
    })
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            packageType.name = req.body.name ? req.body.name : packageType.name;
            packageType.sale = req.body.sale != null ? req.body.sale : packageType.sale;
            packageType.save()
                .then(packageType => {
                    return res.status(200).json({
                        _id: packageType.id,
                        name: packageType.name,
                        sale: packageType.sale,
                        packages: packageType.packages
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

exports.delete_packages = async (req, res, _) => {
    const packages = await Packages.findAll({
        where: {id: req.body.packageIdArray}
    });
    PackageType.findByPk(req.body.packageTypeId)
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'TYPE_NOT_FOUND'
                    }
                });
            }
            packageType.removePackages(packages)
                .then(() => {
                    return res.status(200).json();
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

exports.add_packages = async (req, res, _) => {
    const packages = await Packages.findAll({
        where: {id: req.body.packageIdArray}
    });
    PackageType.findByPk(req.body.packageTypeId, {
        include: Packages
    })
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'TYPE_NOT_FOUND'
                    }
                });
            }
            packageType.addPackages(packages)
                .then(packageType => {
                    return res.status(200).json({
                        _id: packageType.id,
                        name: packageType.name,
                        sale: packageType.sale,
                        packages: packageType.Packages
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
