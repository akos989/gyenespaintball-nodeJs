const express = require('express');
const router = express.Router();

const PackageController = require('../controllers/packages');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');

router.get('/',
    PackageController.get_all
);

router.post('/',
    checkAuth, checkAdmin,
    PackageController.create
);

router.get('/:packageId',
    PackageController.get_one
);

router.patch('/:packageId',
    checkAuth, checkAdmin,
    PackageController.update
);

router.delete('/:packageId',
    checkAuth, checkAdmin,
    PackageController.delete
);

module.exports = router;