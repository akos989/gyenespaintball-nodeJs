const {google} = require('googleapis');
const {OAuth2} = google.auth;
const {getRefreshTokens} = require('./operators');

exports.toggleSync = (req, res, next) => {
    const prevToken = res.locals.prevToken;
    console.log(prevToken)
    res.locals.reservations.forEach(res => {
        if (req.body.googletoken !== '')
            this.addEvent(req.body.googletoken, res, res.packageId);
        else if (prevToken)
            this.deleteEvent(prevToken, res._id.toString());
    });
};

exports.syncCalendar = (req, res, next) => {
    getRefreshTokens(tokens => {
        switch(res.locals.calendarEvent) {
            case 'create':
                tokens.forEach(token => {
                    this.addEvent(token, res.locals.reservationInfo, res.locals.package);
                });
                break;
            case 'update':
                if (!res.locals.reservationInfo.archived) {
                    tokens.forEach(token => {
                        this.updateEvent(token, res.locals.reservationInfo, res.locals.package);
                    });
                }
                break;
            case 'delete':
                tokens.forEach(token => {
                    res.locals.reservations.forEach(reservation => {
                        if (!reservation.archived)
                            this.deleteEvent(token, reservation._id.toString());
                    });
                });
                break;
        }
    } );
};

exports.addEvent = (token, reservation, package) => {
    const oAuth2Client = new OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_SECRET
    );
    oAuth2Client.setCredentials({refresh_token: token});
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    console.log(reservation._id, reservation._id.toString())

    let eventStartTime = new Date(reservation.date);
    let eventEndTime = new Date(reservation.date);
    eventStartTime.setHours(eventEndTime.getUTCHours());
    eventEndTime.setHours(eventEndTime.getUTCHours() + package.duration);

    const event = {
        summary: 'Foglalás - ' + ''+reservation.playerNumber +' fő - ' + reservation.name,
        location: 'Gyenesdiás, Balaton u., 8315',
        description: `
            Név: ${reservation.name}\n
            Email: ${reservation.email}\n
            Létszám: ${reservation.playerNumber} fő\n
            Telefonszám: ${reservation.phoneNumber}\n
            Jegyzetek: ${reservation.notes}\n
            Csomag:\n
                Golyó ár: ${package.bulletPrice} Ft/db\n
                Alapár: ${package.basePrice} Ft\n
                Időtartam: ${package.duration} óra\n
                Tartalmazott golyók: ${package.includedBullets} db
        `,
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

exports.deleteEvent = (token, reservationId) => {
    console.log(reservationId)
    const oAuth2Client = new OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_SECRET
    );
    oAuth2Client.setCredentials({refresh_token: token});
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    calendar.events.delete(
        { calendarId: 'primary', eventId: reservationId },
        (err) => {
            if (err) console.log(err);
        }
    );
};

exports.updateEvent = (token, reservation, package) => {
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

    const event = {
        summary: 'Foglalás - ' + ''+reservation.playerNumber +' fő - ' + reservation.name,
        location: 'Gyenesdiás, Balaton u., 8315',
        description: `
            Név: ${reservation.name}\n
            Email: ${reservation.email}\n
            Létszám: ${reservation.playerNumber} fő\n
            Telefonszám: ${reservation.phoneNumber}\n
            Jegyzetek: ${reservation.notes}\n
            Csomag:\n
                Golyó ár: ${package.bulletPrice} Ft/db\n
                Alapár: ${package.basePrice} Ft\n
                Időtartam: ${package.duration} óra\n
                Tartalmazott golyók: ${package.includedBullets} db
        `,
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
        { calendarId: 'primary', eventId: reservation._id.toString(), resource: event },
        err => {
            if (err) console.log(err);
        }
    );
};