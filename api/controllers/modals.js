const mongoose = require('mongoose');
const Modal = require('../models/modal');

exports.get_all = (req, res, next) => {
    Modal.find()
    .exec()
    .then(modals => {
        res.status(200).json({
            count: modals.length,
            modal: modals.map(modal => {
                return {
                    _id: modal._id,
                    name: modal.name,
                    fromDate: modal.fromDate,
                    toDate: modal.toDate,
                    modalImage: 'http://localhost:3000/'+modal.modalImage,
                    description: modal.description
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
    const modal = new Modal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        modalImage: req.file.path,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
    });
    modal.save()
        .then(result => {
            res.status(201).json({
                _id: result._id,
                name: result.name,
                fromDate: result.fromDate,
                modalImage: 'http://localhost:3000/'+result.modalImage,
                toDate: result.toDate,
                description: result.description
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
    Modal.where('_id').in(req.body.ids)
        .deleteMany()
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
    Modal.findById(req.params.modalId )
        .exec()
        .then(modal => {
            if (!modal) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }
            modal.name = req.body.name ? req.body.name : modal.name;
            modal.description = req.body.description ? req.body.description : modal.description;
            if (req.file)
                modal.modalImage = req.file.path ? req.file.path : modal.modalImage;
            modal.fromDate = req.body.fromDate ? req.body.fromDate : modal.fromDate;
            modal.toDate = req.body.toDate ? req.body.toDate : modal.toDate;
            
            modal.save()
                .then(modal => {                    
                    return res.status(200).json({
                        _id: modal._id,
                        name: modal.name,
                        fromDate: modal.fromDate,
                        toDate: modal.toDate,
                        modalImage: 'http://localhost:3000/'+modal.modalImage,
                        description: modal.description
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

exports.today = (req, res, next) => {
    let addition = 1;
    if (new Date().getUTCHours === 23) {
        addition = 2;
    }
    const today = new Date(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate() + addition,
            1
    );
    Modal.findOne({
        fromDate: { $lt: today },
        toDate: { $gt: today }
    })
        .exec()
        .then(modal => {
            if (!modal) {
                return res.status(200).json({
                    modal: {
		            name: '',
		            description: '',
		            modalImgUrl: ''
		        }
                });
            }
            return res.status(200).json({
                modal: {
                    name: modal.name,
                    description: modal.description,
                    modalImgUrl: 'http://localhost:3000/'+modal.modalImage
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
}
