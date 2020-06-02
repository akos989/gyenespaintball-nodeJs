const http = require('http');
const app = require('./app');
const CronJob = require('cron').CronJob;

const { notify_reservations, autoArchiveReservations } = require('./api/controllers/reservations');

const port = process.env.PORT | 3000;

const server = http.createServer(app);

const notifyJob = new CronJob('00 00 04 * * *',
    function() {
        notify_reservations();
    }
    ,null,	true,'Europe/Budapest');
    
const archiveJob = new CronJob('00 00 23 * * *',
    function() {
        autoArchiveReservations();
    }
    ,null,	true,'Europe/Budapest');

server.listen(port);
