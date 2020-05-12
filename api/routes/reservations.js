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

const getAdmins = require('../middleware/operator/get_admins');

const EmailController = require('../controllers/email');
const ReservationsController = require('../controllers/reservations');
const ScheduleController = require('../controllers/scheduler');

router.get('/',
    checkAuth, checkTemp,
    ReservationsController.get_all
);

router.get('/allForClient',
    ReservationsController.get_all_client
);

router.post('/allForMonth',
    ReservationsController.get_for_month
);

router.post('/',
    setUpNew, findPackage,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.create,
    EmailController.client_reservaion_email, EmailController.send_to_client,
    getAdmins, EmailController.admin_reservation_email, EmailController.send_to_admins,
    EmailController.scheduled_email_content, EmailController.scheduled_email
);

router.get('/:reservationId',
    checkReservationAuth, 
    ReservationsController.get_one
);

router.patch('/:reservationId',
    checkAuth, checkAdmin,
    setUpNew, findPackage,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.update,
    EmailController.client_reservaion_email, EmailController.send_to_client,
    EmailController.scheduled_email_content, EmailController.scheduled_email
);

router.delete('/:reservationId',
    checkAuth, checkAdmin,
    deleteSubscription,
    ReservationsController.delete
    //email
);

module.exports = router;
