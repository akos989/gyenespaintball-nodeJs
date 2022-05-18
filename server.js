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

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const ical = require('ical-generator');

let transporter = nodemailer.createTransport({
    host: 'mail.gyenespaintball.hu',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'kapcsolat@gyenespaintball.hu', // generated ethereal user
        pass: 'Gyenes1230' // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "views"),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "views"),
    extName: ".handlebars",
};

transporter.use('compile', hbs(handlebarOptions));

const content = ical({
    domain: 'gyenespaintball.hu',
    method: 'REQUEST',
    prodId: '//Google Inc//Google Calendar 70.9054//EN',
    timezone: 'Hungary/Budapest',
    scale: 'GREGORIAN',
    events: [
        {
            start: new Date(),
            end: new Date(),
            status: 'CONFIRMED',
            summary: 'Gyenenpaintball foglalás',
            transparency: 'OPAQUE',
            url: 'https://www.gyenespaintball.hu',
            description: 'This is a nice description',
            geo: { lat: 46.76888838542698, lon: 17.27390882592543 },
            location: 'Gyenesdiás, Balaton u., 8315 Hungary',
            // start: [2018, 1, 15, 6, 30],
            // duration: { minutes: 50 }
            busyStatus: 'BUSY',
            organizer: {
                name: 'Gyenespaintball',
                email: 'kapcsolat@gyenespaintball.hu',
                mailto: 'kapcsolat@gyenespaintball.hu'
            }
        }
    ]
}).toString();

let mailOptions = {
    from: '"Gyenespaintball" <kapcsolat@gyenespaintball.hu>', // sender address
    to: 'morvaiakos1998@gmail.com, sarabalint5@gmail.com, borsi.levente1999@gmail.com', // list of receivers
    subject: 'handlebar test', // Subject line
    text: "foglalás", // plain text body
    template: 'index',
    icalEvent: {
        filename: 'gyenespaintball-reservation.ics',
        method: 'request',
        content: content
    }
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
