const http = require('http');
const app = require('./app');
const CronJob = require('cron').CronJob;

const { notify_reservations, autoArchiveReservations } = require('./api/controllers/reservations');

const db = require('./api/config/database');
const { setUpAssociations } = require('./api/config/db_associations');

setUpAssociations();
db.sync({alter: false, force: false})
    .catch(error => console.log(error));

const port = process.env.PORT | 3000;
const server = http.createServer(app);

const notifyJob = new CronJob('00 00 04 * * *',
    function () {
        notify_reservations()
            .catch(e => console.log(e));
    }
    , null, true, 'Europe/Budapest');

const archiveJob = new CronJob('00 00 21 * * *',
    function () {
        autoArchiveReservations()
            .catch(e => console.log(e));
    }
    , null, true, 'Europe/Budapest');

server.listen(port);
