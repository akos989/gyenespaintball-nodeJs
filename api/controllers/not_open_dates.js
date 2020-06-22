const mongoose = require('mongoose');
const NOD = require('../models/not_open_date');

exports.get_all = (req, res, next) => {
    NOD.find()
        .exec()
        .then( nods => {
            res.status(200).json({
                    noDates: nods.map(nod => {
                        return {
                            _id: nod._id,
                            reason: nod.reason,
                            fromDate: nod.fromDate,
                            toDate: nod.toDate
                        }
                    })
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
    let fromDate = new Date(req.body.fromDate);
    fromDate.setHours(fromDate.getUTCHours() - 2);
    let toDate = new Date(req.body.toDate);
    toDate.setHours(toDate.getUTCHours() - 2);
    const noDate = new NOD({
        _id: new mongoose.Types.ObjectId(),
        reason: req.body.reason,
        fromDate: fromDate,
        toDate: toDate
    });
    noDate.save()
        .then(result => {            
            res.status(201).json({
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
exports.update = (req, res, next) => {
    let fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    if (fromDate)
        fromDate.setHours(fromDate.getUTCHours() - 2);
    let toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    if (toDate)
        toDate.setHours(toDate.getUTCHours() - 2);
    NOD.findById(req.params.nodId)
        .exec()
        .then(original => {
            if (original) {
                original.reason = req.body.reason ? req.body.reason : original.reason;                
                original.fromDate = fromDate ? fromDate : original.fromDate;
                original.toDate = toDate ? toDate : original.toDate;

                original.save()
                    .then(result => {            
                        return res.status(201).json({
                            _id: result._id,
                            reason: result.reason,
                            fromDate: result.fromDate,
                            toDate: result.toDate                      
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: {
                                error: 'UPDATE_FAILED',
                                message: err
                            }
                        });
                    });
                } else {                    
                    return res.status(404).json({
                        error: {
                            error: 'NOT_FOUND'
                        }
                    });
                }
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
    NOD.where('_id').in(req.body.ids)
        .deleteMany()
        .exec()
        .then(result => {
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
