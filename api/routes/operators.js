const express = require('express');
const router = express.Router();

const OperatorController = require('../controllers/operators');
const TempOperatorController = require('../controllers/temp_operators');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');

router.get('/', checkAuth, OperatorController.get_all);
router.post('/create/:temp_operatorId',
    TempOperatorController.validate,
    OperatorController.create,
    TempOperatorController.delete_validated
);
router.post('/login', OperatorController.login);
router.delete('/:operatorId', checkAuth, checkAdmin, OperatorController.delete);

module.exports = router;