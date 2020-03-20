const express = require('express');
const router = express.Router();

const SubscriptionController = require('../controllers/subscriptions');
const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkTemp = require('../middleware/auth/check_temp');
const checkReservationId = require('../middleware/reservations/check_valid_id');
const alreadyHas = require('../middleware/subscriptions/already_has');

router.get('/', 
    checkAuth, checkAdmin,
    SubscriptionController.get_all
);

router.post('/:reservationId', 
    checkAuth, checkTemp,
    checkReservationId, alreadyHas,
    SubscriptionController.subscribe
);
router.delete('/:reservationId', 
    checkAuth, checkTemp,
    SubscriptionController.delete
);
router.get('/my_subs', 
    checkAuth,
    SubscriptionController.my_subs
);
module.exports = router;