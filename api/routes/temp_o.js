const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');

const tempOController = require('../controllers/temp_o');

router.get('/',
    checkAuth, checkTemp,
    tempOController.get_all
);

module.exports = router;