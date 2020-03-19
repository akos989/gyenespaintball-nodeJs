const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');

const TempOperatorController = require('../controllers/temp_operators');

router.post('/create', checkAuth, checkAdmin, TempOperatorController.create);
router.get('/can_validate/:operatorId', TempOperatorController.can_validate);

module.exports = router;