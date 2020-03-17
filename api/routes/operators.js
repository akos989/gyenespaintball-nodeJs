const express = require('express');
const router = express.Router();

const OperatorController = require('../controllers/operators');

router.get('/', OperatorController.get_all);
router.post('/create', OperatorController.create);
router.post('/login', OperatorController.login);

module.exports = router;