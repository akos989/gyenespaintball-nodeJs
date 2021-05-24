const Modal = require('../models/modal');
const { Op } = require("sequelize");

exports.get_all = (req, res, _) => {
    Modal.findAll()
        .then(modals => {
            res.status(200).json({
                modals: modals.map(modal => {
                    const path =
                        modal.modalImage !== '' ? modal.modalImage : '';
                    return {
                        _id: modal.id,
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

exports.create = (req, res, _) => {
    const path = req.file ? req.file.path : '';
    const modal = Modal.build({
        name: req.body.name,
        description: req.body.description,
        modalImage: path,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
    });
    modal.save()
        .then(result => {
            const path =
                result.modalImage !== '' ? result.modalImage : '';
            res.status(201).json({
                _id: result.id,
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
exports.delete = (req, res, _) => {
    Modal.destroy({
        where: {id: req.body.ids}
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

exports.update = (req, res, _) => {
    Modal.findByPk(req.params.modalId)
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
                    const path = modal.modalImage !== '' ? modal.modalImage : '';
                    return res.status(200).json({
                        _id: modal.id,
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

exports.today = (req, res, _) => {
    let addition = 1;
    if (new Date().getUTCHours() === 23) {
        addition = 2;
    }
    const today = new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate() + addition,
        1
    );
    Modal.findOne({
        where: {
            fromDate: {[Op.lt]: today},
            toDate: {[Op.gt]: today}
        }
    })
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
