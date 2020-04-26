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
const setUpNew = require('../middleware/reservations/setup_new_reservation');
const findPackage = require('../middleware/package/find_package');

const sendEmail = require('../middleware/email/send_message');
const emailReservationCreated = require('../middleware/email/client_reservation_created');


const ReservationsController = require('../controllers/reservations');

router.get('/',
    checkAuth, checkTemp,
    ReservationsController.get_all
);

router.get('/allForMonth',
    ReservationsController.get_for_month
);

router.post('/',
    setUpNew, findPackage,
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
    setUpNew, findPackage,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.update
    //email
);

router.delete('/:reservationId',
    checkAuth, checkAdmin,
    deleteSubscription,
    ReservationsController.delete
);

module.exports = router;