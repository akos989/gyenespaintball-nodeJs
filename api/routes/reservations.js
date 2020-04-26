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

const sendEmail = require('../middleware/email/send_message');
const emailReservationCreated = require('../middleware/email/client_reservation_created');


const ReservationsController = require('../controllers/reservations');

router.get('/',
    checkAuth, checkTemp,
    ReservationsController.get_all
);
router.post('/',
    checkDate, checkNoDates, checkPackage,
    ReservationsController.create,
    emailReservationCreated, sendEmail
);
router.get('/:reservationId',
    checkReservationAuth, 
    ReservationsController.get_one
);
router.patch('/:reservationId',
    checkAuth, checkAdmin,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.update
);
router.delete('/:reservationId',
    checkAuth, checkAdmin,
    deleteSubscription,
    ReservationsController.delete
);

module.exports = router;