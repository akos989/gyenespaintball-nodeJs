const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkNoDate = require('../middleware//not_open_dates/check_no_date');
const checkTemp = require('../middleware/auth/check_temp');

const NODController = require('../controllers/not_open_dates'); 

router.get('/',
    checkAuth, checkTemp,
    NODController.get_all
);

router.get('/allForMonth',
    NODController.get_for_month
);

router.post('/',
    checkAuth, checkAdmin,
    NODController.create
);
router.get('/:nodId',
    checkAuth, checkTemp,
    NODController.get_one
);
router.patch('/:nodId',
    checkAuth, checkAdmin,
   // checkNoDate,
    NODController.update,
    NODController.delete,
    NODController.create
);
router.delete('/:nodId',
    checkAuth, checkAdmin, 
    NODController.delete
);

module.exports = router;