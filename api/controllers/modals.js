const mongoose = require('mongoose');
const Modal = require('../models/modal');

exports.get_all = (req, res, next) => {
    Modal.find()
    .exec()
    .then(modals => {
        res.status(200).json({
            modals: modals.map(modal => {
                const path =
                modal.modalImage !== '' ? modal.modalImage : '';
                return {
                    _id: modal._id,
                    name: modal.name,
                    fromDate: modal.fromDate,
                    toDate: modal.toDate,
                    modalImgUrl: path,
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
    const path = req.file ? req.file.path : '';
    let fromDate = new Date(req.body.fromDate);
    fromDate.setHours(fromDate.getUTCHours() - 2);
    let toDate = new Date(req.body.toDate);
    toDate.setHours(toDate.getUTCHours() - 2);
    const modal = new Modal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        modalImage: path,
        fromDate: fromDate,
        toDate: toDate
    });
    modal.save()
        .then(result => {
            const path =
                result.modalImage !== '' ? result.modalImage : '';
            res.status(201).json({
                _id: result._id,
                name: result.name,
                fromDate: result.fromDate,
                modalImgUrl: path,
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
    let fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    if (fromDate)
        fromDate.setHours(fromDate.getUTCHours() - 2);
    let toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    if (toDate)
        toDate.setHours(toDate.getUTCHours() - 2);
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
            modal.fromDate = fromDate ? fromDate : modal.fromDate;
            modal.toDate = toDate ? toDate : modal.toDate;
            
            modal.save()
                .then(modal => {
                    const path = modal.modalImage !== '' ? modal.modalImage : '';                
                    return res.status(200).json({
                        _id: modal._id,
                        name: modal.name,
                        fromDate: modal.fromDate,
                        toDate: modal.toDate,
                        modalImgUrl: path,
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
            const path =
                modal.modalImage !== '' ? modal.modalImage : '';
            return res.status(200).json({
                modal: {
                    name: modal.name,
                    description: modal.description,
                    modalImgUrl: path
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
