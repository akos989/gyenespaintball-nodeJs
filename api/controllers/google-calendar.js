const {google} = require('googleapis');
const {OAuth2} = google.auth;
const {getRefreshTokens} = require('./operators');

exports.syncCalendar = (req, res, next) => {
    getRefreshTokens(tokens => {
        switch(res.locals.calendarEvent) {
            case 'create':
                tokens.forEach(token => {
                    this.addEvent(token, res.locals.reservationInfo, res.locals.package);
                });
                break;
            case 'update': 
                break;
            case 'delete': 
                break;
        }
    } );
};

exports.addEvent = (token, reservation, package) => {
    console.log(token, reservation, package)
    const oAuth2Client = new OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_SECRET
    );
    oAuth2Client.setCredentials({refresh_token: token});
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    let eventStartTime = new Date(reservation.date);
    let eventEndTime = new Date(reservation.date);
    eventStartTime.setHours(eventEndTime.getUTCHours());
    eventEndTime.setHours(eventEndTime.getUTCHours() + package.duration);
    // const eventStartTime = new Date(2020, 7, 30, 10);
    // const eventEndTime = new Date(2020, 7, 30, 12);
    console.log(eventStartTime, eventEndTime)

    const event = {
        summary: 'Foglalás - ' + reservation.name,
        location: 'Gyenesdiás, Balaton u., 8315',
        description: 'Új foglalás',
        start: {
            dateTime: eventStartTime,
            timeZone: 'Europe/Budapest'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Europe/Budapest'
        },
        colorId: 9,
        id: reservation._id
    };
    calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
            if (err) console.log(err);
        }
    );
};

exports.deleteEvent = (token, reservation) => {
    const oAuth2Client = new OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_SECRET
    );
    oAuth2Client.setCredentials({refresh_token: '1//0fAG2l41W7UrHCgYIARAAGA8SNwF-L9IrOVuylMDYeYYzxa71ZINMpYq82bsgdYDrd5iHpJBgJ37DyY5k0fD0XiFI6zYH-NhvRiY'});
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    calendar.events.delete(
        { calendarId: 'primary', eventId: reservation._id },
        (err) => {
            if (err) console.log(err);
        }
    );
};

exports.updateEvent = (token, reservation) => {
    const oAuth2Client = new OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_SECRET
    );
    oAuth2Client.setCredentials({refresh_token: '1//0fAG2l41W7UrHCgYIARAAGA8SNwF-L9IrOVuylMDYeYYzxa71ZINMpYq82bsgdYDrd5iHpJBgJ37DyY5k0fD0XiFI6zYH-NhvRiY'});
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const eventStartTime = new Date(2020, 7, 30, 10);
    const eventEndTime = new Date(2020, 7, 30, 12);

    const event = {
        summary: 'Ez most egy updated (2)',
        location: 'Gyenesdiás, Balaton u., 8315',
        description: 'Új foglalás',
        start: {
            dateTime: eventStartTime,
            timeZone: 'Europe/Budapest'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Europe/Budapest'
        },
        colorId: 9
    };
    calendar.events.update(
        { calendarId: 'primary', eventId: reservation._id, resource: event },
        err => {
            if (err) console.log(err);
        }
    );
};