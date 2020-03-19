const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth/check-auth');
const checkReservationAuth = require('../middleware/auth/check-reservation-auth');
const checkAdmin = require('../middleware/auth/check-admin');
const checkDate = require('../middleware/reservations/check_date');

const ReservationsController = require('../controllers/reservations');

router.get('/', checkAuth, ReservationsController.get_all);
router.post('/', checkDate, ReservationsController.create);
router.get('/:reservationId', checkReservationAuth, ReservationsController.get_one);
router.patch('/:reservationId',
    checkReservationAuth,
    checkAdmin,
    ReservationsController.update,
    checkDate,
    ReservationsController.delete,
    ReservationsController.create
);
router.delete('/:reservationId',
    checkReservationAuth,
    checkAdmin,
    ReservationsController.delete
);

module.exports = router;