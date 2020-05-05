const mongoose = require('mongoose');

const PackageType = require('../models/package-type');

exports.get_all = (req, res, next) => {
    PackageType.find()
    .populate("packages")
    .exec()
    .then(packageTypes => {
        res.status(200).json({
            types: packageTypes.map(packageType => {
                return {
                    id: packageType._id,
                    name: packageType.name,
                    sale: packageType.sale,
                    packages: packageType.packages
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
    PackageType.findOne({ name: req.body.name })
        .exec()
        .then(result => {
            if (result) {
                res.status(500).json({
                    error: {
                        error: 'NAME_EXISTS'
                    }
                });
            }
            const packageType = new PackageType({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                sale: req.body.sale
            });
            packageType.save()
                .then(packageType => {
                    res.status(201).json({
                        _id: packageType._id,
                        name: packageType.name,
                        sale: packageType.sale
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

exports.delete = (req, res, next) => {
    PackageType.deleteOne({ _id: req.params.packageTypeId })
        .exec()
        .then(result => {
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

exports.update = (req, res, next) => {
    PackageType.findById(req.params.packageTypeId )
        .exec()
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            
            packageType.name = req.body.name ? req.body.name : packageType.name;
            packageType.sale = req.body.sale ? req.body.sale : packageType.sale;            
            
            packageType.save()
                .then(packageType => {                    
                    return res.status(200).json({
                        message: 'SUCCESSFUL_UPDATE',
                        _id: packageType._id,
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

exports.delete_packages = (req, res, next) => {
    PackageType.findById(req.params.packageTypeId)
        .exec()
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'TYPE_NOT_FOUND'
                    }
                });
            }
            for (const packageId of req.body.packageIdArray) {
                const idx = packageType.packages.indexOf(packageId);
                if (idx !== -1)
                    packageType.packages.splice(idx, 1);
            }
            packageType.save()
            .then(packageType => {                    
                return res.status(200).json({
                    message: 'SUCCESSFUL_UPDATE',
                    _id: packageType._id,
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

exports.add_packages = (req,res, next) => {
    PackageType.findById(req.params.packageTypeId)
        .exec()
        .then(packageType => {
            if (!packageType) {
                return res.status(404).json({
                    error: {
                        error: 'TYPE_NOT_FOUND'
                    }
                });
            }
            for (const packageId of req.body.packageIdArray) {
                packageType.packages.push(packageId);
            }
            packageType.save()
            .then(packageType => {                    
                return res.status(200).json({
                    message: 'SUCCESSFUL_UPDATE',
                    _id: packageType._id,
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