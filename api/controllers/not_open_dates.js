const mongoose = require('mongoose');
const NOD = require('../models/not_open_date');

exports.get_all = (req, res, next) => {
    NOD.find()
        .exec()
        .then( nods => {
            res.status(200).json({
                count: nods.length,
                noDates: {
                    noDate: nods.map(nod => {
                        return {
                            _id: nod._id,
                            reason: nod.reason,
                            fromDate: nod.fromDate,
                            toDate: nod.toDate
                        }
                    })
                }                
            });
        } )
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
    const noDate = new NOD({
        _id: new mongoose.Types.ObjectId(),
        reason: req.body.reason,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
    });
    noDate.save()
        .then(result => {            
            res.status(201).json({
                message: 'CREATED',
                _id: result._id,
                reason: result.reason,
                fromDate: result.fromDate,
                toDate: result.toDate                      
            });
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    error: 'CREATE_FAILED',
                    message: err
                }
            });
        });
};

exports.get_one = (req, res, next) => {
    NOD.findById(req.params.nodId)
        .exec()
        .then(noDate => {
            if (!noDate) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            res.status(200).json({
                message: 'FOUND',
                _id: noDate._id,
                reason: noDate.reason,
                fromDate: noDate.fromDate,
                toDate: noDate.toDate
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

exports.update = (req, res, next) => {
    NOD.findById(req.params.nodId)
        .exec()
        .then(original => {
            if (original) {
                req.body.reason = req.body.reason ? req.body.reason : original.reason;
                
                original.fromDate.setHours(original.fromDate.getHours() - 1);
                req.body.fromDate = req.body.fromDate ? req.body.fromDate : original.fromDate;
                original.toDate.setHours(original.toDate.getHours() - 1);
                req.body.toDate = req.body.toDate ? req.body.toDate : original.toDate;

                res.locals.update = true;

                return next();
            }
            return res.status(404).json({
                error: {
                    error: 'NOT_FOUND'
                }
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
    NOD.deleteOne({ _id: req.params.nodId })
        .exec()
        .then(result => {
            if (res.locals.update) {
                return next();
            }
            return res.status(200).json({
                message: 'DELETED'
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