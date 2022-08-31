const Message = require("../models/message");
const MessageEmail = require('../models/MessageEmail');
const MessageEmailTypes = require('../models/MessageEmailTypes');

exports.get_all = (req, res, _) => {
    Message.findAll()
        .then(messages => {
            return res.status(200).json({
                messages: messages.map(message => {
                    return {
                        _id: message.id,
                        name: message.name,
                        email: message.email,
                        text: message.text,
                        replied: message.replied,
                        reply: message.reply,
                        timestamp: message.createdAt
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

exports.create = (req, res, _) => {
    const message = Message.build({
        name: req.body.name,
        email: req.body.email,
        text: req.body.text
    });

    message.save()
        .then(result => {
            const messageEmailData = {
                name: result.name,
                text: result.text,
                email: result.email
            };
            const messageClientEmail = new MessageEmail({
                message: messageEmailData,
                messageEmailType: MessageEmailTypes.Created,
                receiver: messageEmailData.email,
                adminPhoneNumbers: res.locals.adminPhoneNumbers
            });

            const messageAdminEmail = new MessageEmail({
                message: messageEmailData,
                messageEmailType: MessageEmailTypes.Admin,
                receiver: res.locals.adminEmails,
                adminPhoneNumbers: res.locals.adminPhoneNumbers
            });

            messageClientEmail.send();
            messageAdminEmail.send();

            return res.status(201).json({
                _id: result.id,
                name: result.name,
                email: result.email,
                text: result.text,
                replied: result.replied,
                reply: result.reply
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

exports.delete = (req, res, _) => {
    Message.destroy({
        where: {id: req.body.ids}
    })
        .then(() => {
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

exports.reply = (req, res, _) => {
    if (!req.body.replyBody) {
        return res.status(500).json({
            error: {
                error: 'NO_REPLY_BODY'
            }
        });
    }
    Message.findByPk(req.params.messageId)
        .then(message => {
            if (!message) {
                return res.status(404).json({
                    error: {
                        error: 'NOT_FOUND'
                    }
                });
            }

            message.replied = req.body.replier;
            message.reply = req.body.replyBody;
            message.save()
                .then(result => {
                    const messageEmailData = {
                        name: result.name,
                        text: result.text,
                        email: result.email,
                        reply: result.reply,
                        replied: result.replied
                    };
                    const messageClientEmail = new MessageEmail({
                        message: messageEmailData,
                        messageEmailType: MessageEmailTypes.Reply,
                        receiver: messageEmailData.email,
                        adminPhoneNumbers: res.locals.adminPhoneNumbers
                    });
                    messageClientEmail.send();

                    return res.status(201).json({
                        _id: result.id,
                        name: result.name,
                        email: result.email,
                        text: result.text,
                        replied: result.replied,
                        reply: result.reply,
                        timestamp: result.createdAt
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
