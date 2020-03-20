const mongoose = require('mongoose');

const Package = require('../models/package');

exports.get_all = (req, res, next) => {
    Package.find()
    .exec()
    .then(packages => {
        res.status(200).json({
            count: packages.length,
            package: packages.map(package => {
                return {
                    _id: package._id,
                    name: package.name,
                    fromNumberLimit: package.fromNumberLimit,
                    toNumberLimit: package.toNumberLimit,
                    bulletPrice: package.bulletPrice,
                    basePrice: package.basePrice,
                    duration: package.duration,
                    sale: package.sale,
                    includedBullets: package.includedBullets
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
    Package.findOne({ name: req.body.name })
        .exec()
        .then(result => {
            if (result) {
                res.status(500).json({
                    error: {
                        error: 'NAME_EXISTS'
                    }
                });
            }
            const package = new Package({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                fromNumberLimit: req.body.fromNumberLimit,
                toNumberLimit: req.body.toNumberLimit,
                bulletPrice: req.body.bulletPrice,
                basePrice: req.body.basePrice,
                duration: req.body.duration,
                sale: req.body.sale,
                includedBullets: req.body.includedBullets
            });
            package.save()
                .then(package => {
                    res.status(201).json({
                        _id: package._id,
                        name: package.name,
                        fromNumberLimit: package.fromNumberLimit,
                        toNumberLimit: package.toNumberLimit,
                        bulletPrice: package.bulletPrice,
                        basePrice: package.basePrice,
                        duration: package.duration,
                        sale: package.sale,
                        includedBullets: package.includedBullets
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

exports.get_one = (req, res, next) => {
    Package.findById(req.params.packageId)
        .exec()
        .then(package => {
            if (!package) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }                                
            return res.status(200).json({
                _id: package._id,
                name: package.name,
                fromNumberLimit: package.fromNumberLimit,
                toNumberLimit: package.toNumberLimit,
                bulletPrice: package.bulletPrice,
                basePrice: package.basePrice,
                duration: package.duration,
                sale: package.sale,
                includedBullets: package.includedBullets
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
    Package.deleteOne({ _id: req.params.packageId })
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
    Package.findById(req.params.packageId )
        .exec()
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
            package.sale = req.body.sale ? req.body.sale : package.sale; 
            package.includedBullets = req.body.includedBullets ? req.body.includedBullets : package.includedBullets;

            package.save()
                .then(package => {                    
                    return res.status(200).json({
                        message: 'SUCCESSFUL_UPDATE',
                        _id: package._id,
                        name: package.name,
                        fromNumberLimit: package.fromNumberLimit,
                        toNumberLimit: package.toNumberLimit,
                        bulletPrice: package.bulletPrice,
                        basePrice: package.basePrice,
                        duration: package.duration,
                        sale: package.sale,
                        includedBullets: package.includedBullets
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
