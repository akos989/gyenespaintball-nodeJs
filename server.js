// const http = require('http');
// const app = require('./app');
// const CronJob = require('cron').CronJob;
//
// const {notify_reservations, autoArchiveReservations} = require('./api/controllers/reservations');
//
// const db = require('./api/config/database');
// const {setUpAssociations} = require('./api/config/db_associations');
//
// setUpAssociations();
// db.sync({alter: true});
//
// const port = process.env.PORT | 3000;
// const server = http.createServer(app);
//
// const notifyJob = new CronJob('00 00 04 * * *',
//     function () {
//         notify_reservations();
//     }
//     , null, true, 'Europe/Budapest');
//
// const archiveJob = new CronJob('00 00 21 * * *',
//     function () {
//         autoArchiveReservations();
//     }
//     , null, true, 'Europe/Budapest');
//
// server.listen(port);

const ReservationClientEmail = require('./api/models/ReservationClientEmail');
const ReservationEmailTypes = require('./api/models/ReservationEmailTypes');

const startTime1 = new Date(2022, 8, 10, 10);
const startTime2 = new Date(2022, 7, 10, 10);
const startTime3 = new Date(2022, 9, 10, 10);

const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
const reservations = [
    {
        name: "Akos Morvai",
        email: "morvaiakos1998@gmail.com",
        phoneNumber: '062023120120',
        playerNumber: 21,
        notes: 'itt van valmai kis megjegyzés',
        date: startTime1,
        archived: false,
        package: {
            duration: 2,
            basePrice: 6000,
            bulletPrice: 15,
            includedBullets: 200
        }
    },
    {
        name: "Akos Kiss",
        email: "morvaiakos1998@gmail.com",
        phoneNumber: '23424234',
        playerNumber: 2,
        notes: 'itt van valmai kis megjegyzés',
        date: startTime2,
        archived: false,
        package: {
            duration: 2,
            basePrice: 6000,
            bulletPrice: 15,
            includedBullets: 200
        }
    },
    {
        name: "Akos Nagy",
        email: "morvaiakos1998@gmail.com",
        phoneNumber: '062023120120',
        playerNumber: 30,
        notes: 'itt van valmai kis megjegyzés',
        date: startTime3,
        archived: false,
        package: {
            duration: 2,
            basePrice: 6000,
            bulletPrice: 15,
            includedBullets: 200
        }
    }
];

for (const reservation of reservations) {
    const reservationClientEmail = new ReservationClientEmail({
        reservation: reservation,
        reservationEmailType: ReservationEmailTypes.Created,
        receiver: reservation.email
    });
    reservationClientEmail.send();
}

