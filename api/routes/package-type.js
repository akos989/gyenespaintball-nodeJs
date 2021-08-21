const express = require('express');
const router = express.Router();

const PackageTypeController = require('../controllers/package-types');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkPackageIds = require('../middleware/package/check_package_ids');

router.get('/',
    PackageTypeController.get_all
);
router.post('/',
    checkAuth, checkAdmin,
    PackageTypeController.create
);
router.patch('/:packageTypeId',
    checkAuth, checkAdmin,
    PackageTypeController.update
);
router.delete('/:packageTypeId',
    checkAuth, checkAdmin,
    PackageTypeController.delete
);
router.post('/delete_packages/:packageTypeId',
    checkAuth, checkAdmin,
    PackageTypeController.delete_packages
);
router.post('/add_packages/:packageTypeId',
    checkAuth, checkAdmin,
    checkPackageIds,
    PackageTypeController.add_packages
);

module.exports = router;
