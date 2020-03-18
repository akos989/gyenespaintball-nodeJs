const express = require('express');
const router = express.Router();

const TempOperatorController = require('../controllers/temp_operators');

router.post('/create', TempOperatorController.create);
router.get('/can_validate/:operatorId', TempOperatorController.can_validate);

module.exports = router;