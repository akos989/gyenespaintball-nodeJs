const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkNoDate = require('../middleware//not_open_dates/check_no_date');

const NODController = require('../controllers/not_open_dates'); 

router.get('/', checkAuth, NODController.get_all);
router.post('/', checkAuth, checkAdmin, checkNoDate, NODController.create);
router.get('/:nodId', checkAuth, NODController.get_one);
router.patch('/:nodId',
    checkAuth, checkAdmin,
    checkNoDate,
    NODController.update,
    NODController.delete,
    NODController.create
);
router.delete('/:nodId', checkAuth, checkAdmin, NODController.delete);

module.exports = router;