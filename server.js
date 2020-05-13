const http = require('http');
const app = require('./app');
const CronJob = require('cron').CronJob;

const { notify_reservations, autoArchiveReservations } = require('./api/controllers/reservations');

const port = process.env.PORT | 3000;

const server = http.createServer(app);

// const job = new CronJob('1 * * * * *', function() {
//     const array = notify_reservations();
//     console.log(array);
//     // console.log('You will see this message every second');
// }, null, true, 'Europe/Budapest');
// job.start();


const job = new CronJob('00 13 22 * * *',
    function() {
        notify_reservations();
        autoArchiveReservations();
    }
    ,null,	true,'Europe/Budapest');


server.listen(port);