const http = require('http');
// const https = require('https');
// const fs = require('fs');
const app = require('./app');
const CronJob = require('cron').CronJob;

const {notify_reservations, autoArchiveReservations} = require('./api/controllers/reservations');

const port = process.env.PORT | 3000;

// const options = {
//     key: fs.readFileSync('cert/key.pem'),
//     cert: fs.readFileSync('cert/cert.pem')
// };

const db = require('./api/config/database');
const {setUpAssociations} = require('./api/config/db_associations');

setUpAssociations();
db.sync({alter: true});

const server = http.createServer(app);

const notifyJob = new CronJob('00 00 04 * * *',
    function () {
        notify_reservations();
    }
    , null, true, 'Europe/Budapest');

const archiveJob = new CronJob('00 00 21 * * *',
    function () {
        autoArchiveReservations();
    }
    , null, true, 'Europe/Budapest');

server.listen(port);
