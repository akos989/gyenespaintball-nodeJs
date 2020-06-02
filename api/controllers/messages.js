const mongoose = require('mongoose');
const Message = require("../models/message");

exports.get_all = (req, res, next) => {
    Message.find()
        .exec()
        .then(messages => {
            return res.status(200).json({
                messages: messages.map(message => {
                    return {
                        id: message._id,
                        name: message.name,
                        email: message.email,
                        text: message.text,
                        replied: message.replied
                    }
                })
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
};

exports.create = (req, res, next) => {
    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        text: req.body.text
    });

    message.save()
        .then(result => {
            res.locals.emailSubject = 'Új üzenet';
            res.locals.emailTitle = 'Köszönjük, hogy hagyott üzenetet!';
            res.locals.reservationInfo = result;
            res.locals.messageInfo = result;
            res.locals.adminEmail = true;
            next();

            res.status(201).json({
                id: result._id,
                name: result.name,
                email: result.email,
                text: result.text,
                replied: result.replied
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
};

exports.delete = (req, res, next) => {
    Message.deleteOne({_id: req.params.messageId})
        .then(result => {
            return res.status(200).json({
                message: 'DELETE_SUCCESFUL'
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
};

exports.reply = (req, res, next) => {
    if (!req.body.replyBody) {
        return res.status(500).json({
            error: {
                error: 'NO_REPLY_BODY'
            }
        });
    }
    Message.findById(req.params.messageId)
        .exec()
        .then(message => {
            if (!message) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }

            message.replied = true;
            message.save()
                .then(result => {
                    res.locals.emailSubject = 'Válasz';
                    res.locals.replyBody = req.body.replyBody;
                    res.locals.messageInfo = result;
                    res.locals.reservationInfo = result;
                    res.locals.adminEmail = false;
                    next();

                    res.status(201).json({
                        id: result._id,
                        name: result.name,
                        email: result.email,
                        text: result.text,
                        replied: result.replied
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        error: {
                            error: 'FAILED',
                            message: err
                        }
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                error: {
                    error: 'FAILED',
                    message: err
                }
            });
        });
};
