const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkNoDate = require('../middleware//not_open_dates/check_no_date');
const checkTemp = require('../middleware/auth/check_temp');

const NODController = require('../controllers/not_open_dates'); 

router.get('/',
    NODController.get_all
);
router.post('/',
    checkAuth, checkAdmin,
    checkNoDate,
    NODController.create
);
router.patch('/:nodId',
    checkAuth, checkAdmin,
    checkNoDate,
    NODController.update
);
router.delete('/',
    checkAuth, checkAdmin, 
    NODController.delete
);

module.exports = router;
