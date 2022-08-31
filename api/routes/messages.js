const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');
const getAdmins = require('../middleware/operator/get_admins');

const MessageController = require('../controllers/messages');

router.get('/',
    checkAuth, checkTemp,
    MessageController.get_all
);

router.post('/',
    getAdmins,
    MessageController.create
);

router.delete('/',
    checkAuth, checkAdmin,
    MessageController.delete
);

router.post('/reply/:messageId',
    checkAuth, checkAdmin,
    getAdmins,
    MessageController.reply
);

module.exports = router;
