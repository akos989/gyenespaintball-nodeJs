const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkDate = require('../middleware/reservations/check_date');
const checkNoDates = require('../middleware/reservations/check_no_dates');
const checkTemp = require('../middleware/auth/check_temp');
const checkPackage = require('../middleware/package/check_package');
const setUpNew = require('../middleware/reservations/setup_new_reservation');
const findPackage = require('../middleware/package/find_package');
const setUpForDelete = require('../middleware/reservations/setUpForDelete');

const getAdmins = require('../middleware/operator/get_admins');

const EmailController = require('../controllers/email');
const ReservationsController = require('../controllers/reservations');
const OperatorController = require('../controllers/operators');

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
    OperatorController.new_reservation,
    getAdmins,
    EmailController.client_reservaion_email, EmailController.send_to_client,
    EmailController.admin_reservation_email, EmailController.send_to_admins
);
router.patch('/:reservationId',
    checkAuth, checkAdmin,
    setUpNew, findPackage,
    checkDate, checkNoDates, checkPackage,
    ReservationsController.update,
    EmailController.client_reservaion_email, EmailController.send_to_client
);

router.post('/toggleArchived',
    checkAuth, checkAdmin,
    ReservationsController.toggleArchived
);

router.delete('/',
    checkAuth, checkAdmin,
    setUpForDelete,
    ReservationsController.delete,
    EmailController.client_reservaion_email, EmailController.send_to_client
);

module.exports = router;
