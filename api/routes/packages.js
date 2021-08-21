const express = require('express');
const router = express.Router();

const PackageController = require('../controllers/packages');
const PackageTypeController = require('../controllers/package-types');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');

router.get('/',
    PackageController.get_all
);

router.post('/',
    checkAuth, checkAdmin,
    PackageTypeController.typeExists,
    PackageController.create,
    PackageTypeController.add_packages
);

router.get('/:packageId',
    PackageController.get_one
);

router.patch('/:packageId',
    checkAuth, checkAdmin,
    PackageController.update
);

router.delete('/',
    checkAuth, checkAdmin,
    PackageTypeController.typeExists,
    PackageController.delete,
    PackageTypeController.delete_packages
);
router.post('/disable', 
    checkAuth, checkAdmin,
    PackageController.disable
);

module.exports = router;
