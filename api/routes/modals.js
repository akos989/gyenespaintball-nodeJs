const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/modals');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilter
});
const ModalController = require('../controllers/modals');

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkDates = require('../middleware/modal/check-date');

router.get('/',
    checkAuth, checkAdmin,
    ModalController.get_all
);
router.get('/today',
    ModalController.today
);
router.post('/',
    checkAuth,
    upload.single('modalImage'),
    checkAdmin, checkDates,
    ModalController.create
);
router.patch('/:modalId',
    checkAuth, checkAdmin, checkDates,
    upload.single('modalImage'),
    ModalController.update
);
router.delete('/',
    checkAuth, checkAdmin,
    ModalController.delete
);
module.exports = router;