const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');
const getAdmins = require('../middleware/operator/get_admins');

const MessageController = require('../controllers/messages');
const EmailController = require('../controllers/email');

router.get('/',
    checkAuth, checkTemp,
    MessageController.get_all
);

router.post('/',
    MessageController.create,
    EmailController.client_message_create_body, EmailController.send_to_client,
    getAdmins,
    EmailController.admin_message_create_body, EmailController.send_to_admins
);

router.delete('/',
    checkAuth, checkAdmin,
    MessageController.delete
);

router.post('/reply/:messageId',
    checkAuth, checkAdmin,
    MessageController.reply,
    EmailController.client_message_reply_body, EmailController.send_to_client
);

module.exports = router;
