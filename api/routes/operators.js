const express = require('express');
const router = express.Router();

const OperatorController = require('../controllers/operators');
const TempOperatorController = require('../controllers/temp_operators');

router.get('/', OperatorController.get_all);
router.post('/create/:temp_operatorId',
    TempOperatorController.validate,
    OperatorController.create,
    TempOperatorController.delete_validated
);
router.post('/login', OperatorController.login);

module.exports = router;