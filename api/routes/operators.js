const express = require('express');
const router = express.Router();

const OperatorController = require('../controllers/operators');
const TempOperatorController = require('../controllers/temp_operators');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');
const checkEmail = require('../middleware/operator/check_email');
const checkOldPass = require('../middleware/operator/check_old_pass');
const hashPass = require('../middleware/operator/hash_pass');
const checkOwn = require('../middleware/auth/check-own');
const check_same_user = require('../middleware/auth/check-same-user');

router.get('/', checkAuth, checkTemp, OperatorController.get_all);
router.post('/create/:temp_operatorId',
    TempOperatorController.validate,
    OperatorController.create,
    TempOperatorController.delete_validated
);
router.post('/login', OperatorController.login);
router.delete('/:operatorId',
    checkAuth, checkAdmin,
    OperatorController.delete
);
router.patch('/:operatorId',
    checkAuth, checkOwn,
    checkEmail, checkOldPass, hashPass,
    OperatorController.update
);
router.get('/temporary',
    checkAuth, checkTemp,
    OperatorController.get_all_temporary
);
router.post('/my_account',
    checkAuth, check_same_user,
    OperatorController.get_my_account
);
router.post('/view_reservation',
    checkAuth, check_same_user,
    OperatorController.view_reservation
);

module.exports = router;
