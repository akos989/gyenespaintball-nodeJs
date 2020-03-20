const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkReservationAuth = require('../middleware/auth/check-reservation-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkDate = require('../middleware/reservations/check_date');
const checkNoDates = require('../middleware/reservations/check_no_dates');
const checkTemp = require('../middleware/auth/check_temp');
const deleteSubscription = require('../middleware/subscriptions/delete_sub_with_reservation');
const checkPackage = require('../middleware/package/check_package');

const ReservationsController = require('../controllers/reservations');

router.get('/',
    checkAuth, checkTemp,
    ReservationsController.get_all
);
router.post('/',
    checkDate, checkNoDates, checkPackage,
    ReservationsController.create
);
router.get('/:reservationId',
    checkReservationAuth, 
    ReservationsController.get_one
);
router.patch('/:reservationId',
    checkReservationAuth, checkAdmin,
    ReservationsController.update,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.delete,
    ReservationsController.create
);
router.delete('/:reservationId',
    checkReservationAuth, checkAdmin,
    deleteSubscription,
    ReservationsController.delete
);

module.exports = router;