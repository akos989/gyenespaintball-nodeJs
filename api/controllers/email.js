const nodemailer = require('nodemailer');

exports.admin_reservation_email = (req, res, next) => {
    const date = new Date(res.locals.reservationInfo.date.getUTCFullYear(),
        res.locals.reservationInfo.date.getUTCMonth(),
        res.locals.reservationInfo.date.getUTCDate(),
        res.locals.reservationInfo.date.getUTCHours(),
        res.locals.reservationInfo.date.getUTCMinutes());
    date.setUTCMinutes(date.getUTCMinutes() - date.getTimezoneOffset());
    const hour = date.getUTCHours();
    res.locals.emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Új foglalás érkezett!</h1>
            <hr>
            <h2>Foglalás adatai:</h2>
            <div style="padding-bottom: 30px;">
                <div style="font-weight: bold;">Név:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.name}</div>
                <div style="font-weight: bold;">Email:</div>
                <div style="padding-bottom: 10px;"><a href="mailto:${res.locals.reservationInfo.email}">${res.locals.reservationInfo.email}</a></div>
                <div style="font-weight: bold;">Telefonszám:</div>
                <div style="padding-bottom: 10px;"><a href="tel:${res.locals.reservationInfo.phoneNumber}">${res.locals.reservationInfo.phoneNumber}</a></div>
                <div style="font-weight: bold;">Játékosszám:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.playerNumber}</div>
                <div style="font-weight: bold;">Dátum:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.date.toISOString().slice(0, 10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${res.locals.reservationInfo.date.getMinutes() < 10 ? '0' + res.locals.reservationInfo.date.getMinutes() : res.locals.reservationInfo.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.basePrice} Ft</div>
                <div style="font-weight: bold;">Golyó ára:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.bulletPrice} Ft/db</div>
                <div style="font-weight: bold;">Lövedék az árban:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.includedBullets} db</div>
                <div style="font-weight: bold;">Megjegyzések:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.notes ? res.locals.reservationInfo.notes : '-'}</div>
            </div>
        </div>
    `;
    return next();
};

exports.client_reservaion_email = (req, res, next) => {
    if (res.locals.moreReservations) {
        messages = [];
        emailAddresses = [];
        res.locals.reservations.forEach(reservation => {
            emailAddresses.push(reservation.email);
            messages.push(makeClientEmail(
                reservation,
                reservation.packageId,
                res.locals.emailTitle,
                res.locals.emailDetails
            ));
        });
        res.locals.emailAddresses = emailAddresses;
        res.locals.emailBodies = messages;
    } else {
        res.locals.emailBody = makeClientEmail(
            res.locals.reservationInfo,
            res.locals.package,
            res.locals.emailTitle,
            res.locals.emailDetails
        );
    }
    return next();
}

function makeClientEmail(reservationInfo, package, emailTitle, emailDetails) {
    const date = new Date(reservationInfo.date.getUTCFullYear(),
        reservationInfo.date.getUTCMonth(),
        reservationInfo.date.getUTCDate(),
        reservationInfo.date.getUTCHours(),
        reservationInfo.date.getUTCMinutes());
    date.setUTCMinutes(date.getUTCMinutes() - date.getTimezoneOffset());
    const hour = date.getUTCHours();
    return `
      <div style="text-align: center;">
          <h1 style="padding-bottom: 30px;">Kedves ${reservationInfo.name}!</h1>
          <h2 style="padding-bottom: 30px;"> ${emailTitle} </h2>
          <div style="padding-bottom: 30px;">${emailDetails}</div>
          <hr>
          <h2>Foglalás adatai:</h2>
          <div style="padding-bottom: 30px;">
              <div style="font-weight: bold;">Név:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.name}</div>
              <div style="font-weight: bold;">Email:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.email}</div>
              <div style="font-weight: bold;">Telefonszám:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.phoneNumber}</div>
              <div style="font-weight: bold;">Játékosszám:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.playerNumber}</div>
              <div style="font-weight: bold;">Dátum:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.date.toISOString().slice(0, 10)}
              ${(hour < 10) ? ('0' + hour) : hour}:${reservationInfo.date.getMinutes() < 10 ? '0' + reservationInfo.date.getMinutes() : reservationInfo.date.getMinutes()}</div>
              <div style="font-weight: bold;">Időtartam:</div>
              <div style="padding-bottom: 10px;">${package.duration} óra</div>
              <div style="font-weight: bold;">Alapár:</div>
              <div style="padding-bottom: 10px;">${package.basePrice} Ft</div>
              <div style="font-weight: bold;">Golyó ára:</div>
              <div style="padding-bottom: 10px;">${package.bulletPrice} Ft/db</div>
              <div style="font-weight: bold;">Lövedék az árban:</div>
              <div style="padding-bottom: 10px;">${package.includedBullets} db</div>
              <div style="font-weight: bold;">Megjegyzések:</div>
              <div style="padding-bottom: 10px;">${reservationInfo.notes ? reservationInfo.notes : '-'}</div>
          </div>
      </div>
      <hr>  
      <div style="text-align:center;">
          <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
          <div>Balaton utca, Gyenesdiás</div><div>8315</div>
          <hr>
          <div> Tel:</div>
          <div><a href="tel:+36208028647">+36208028647</a></div>
          <div><a href="tel:+36306083283">+36306083283</a></div>
          <div style="padding-top: 2vh;">Email:</div>
          <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
          <hr>
          <div style="padding-top: 5vh; padding-bottom: 5vh;">
              <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
              <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
          </div> 
      </div>
  `;
}


exports.send_to_client = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ADDR, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object

    if (res.locals.moreReservations) {
        for (let i = 0; i < res.locals.emailAddresses.length; i++) {
            if (!res.locals.reservations[i].archived)
                sendEmailToClient(
                    transporter,
                    res.locals.emailAddresses[i],
                    res.locals.emailBodies[i],
                    res.locals.emailSubject
                );
        }
    } else {
        sendEmailToClient(
            transporter,
            res.locals.reservationInfo.email,
            res.locals.emailBody,
            res.locals.emailSubject
        );
    }
    if (res.locals.adminEmails) {
        return next();
    }
};

function sendEmailToClient(transporter, receiver, body, subject) {
    let mailOptions = {
        from: '"Gyenespaintball" <kapcsolat@gyenespaintball.hu>', // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        text: "foglalás", // plain text body
        html: body, // html body
        attachments: [
            {
                filename: 'instagram-sketched.png',
                path: process.cwd() + '/email/instagram-sketched.png',
                cid: 'insta'
            },
            {
                filename: 'facebook.png',
                path: process.cwd() + '/email/facebook.png',
                cid: 'facebook'
            }
        ]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}

exports.send_to_admins = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ADDR, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object

    let mailOptions = {
        from: '"Gyenespaintball" <kapcsolat@gyenespaintball.hu>', // sender address
        to: res.locals.adminEmails, // list of receivers
        subject: res.locals.emailSubject, // Subject line
        text: "Új foglalás", // plain text body
        html: res.locals.emailBody
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
};


exports.scheduled_email = (to, htmlBody, emailSubject) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ADDR, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object

    let mailOptions = {
        from: '"Gyenespaintball" <kapcsolat@gyenespaintball.hu>', // sender address
        to: to, // list of receivers
        subject: emailSubject, // Subject line
        text: "Emlékeztető", // plain text body
        html: htmlBody, // html body
        attachments: [
            {
                filename: 'instagram-sketched.png',
                path: process.cwd() + '/email/instagram-sketched.png',
                cid: 'insta'
            },
            {
                filename: 'facebook.png',
                path: process.cwd() + '/email/facebook.png',
                cid: 'facebook'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
};

exports.scheduled_email_content = (reservation, package) => {
    const date = new Date(
        reservation.date.getUTCFullYear(),
        reservation.date.getUTCMonth(),
        reservation.date.getUTCDate(),
        reservation.date.getUTCHours(),
        reservation.date.getUTCMinutes()
    );
    date.setUTCMinutes(date.getUTCMinutes() - date.getTimezoneOffset());
    const hour = date.getUTCHours();
    const emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${reservation.name}!</h1>
            <div style="padding-bottom: 30px;"> Emlékeztetjük, hogy korábban foglalt paintball időpontja 48 órán belül esedékes. A foglalással kapcsolatos adatokat lent megtalálja.</div>
            <hr>
            <h2>Foglalás adatai:</h2>
            <div style="padding-bottom: 30px;">
                <div style="font-weight: bold;">Név:</div>
                <div style="padding-bottom: 10px;">${reservation.name}</div>
                <div style="font-weight: bold;">Email:</div>
                <div style="padding-bottom: 10px;">${reservation.email}</div>
                <div style="font-weight: bold;">Telefonszám:</div>
                <div style="padding-bottom: 10px;">${reservation.phoneNumber}</div>
                <div style="font-weight: bold;">Játékosszám:</div>
                <div style="padding-bottom: 10px;">${reservation.playerNumber}</div>
                <div style="font-weight: bold;">Dátum:</div>
                <div style="padding-bottom: 10px;">${reservation.date.toISOString().slice(0, 10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${reservation.date.getMinutes() < 10 ? '0' + reservation.date.getMinutes() : reservation.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${package.basePrice} Ft</div>
                <div style="font-weight: bold;">Golyó ára:</div>
                <div style="padding-bottom: 10px;">${package.bulletPrice} Ft/db</div>
                <div style="font-weight: bold;">Lövedék az árban:</div>
                <div style="padding-bottom: 10px;">${package.includedBullets} db</div>
                <div style="font-weight: bold;">Megjegyzések:</div>
                <div style="padding-bottom: 10px;">${reservation.notes ? reservation.notes : '-'}</div>
            </div>
        </div>
        <hr>  
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel:</div>
            <div><a href="tel:+36208028647">+36208028647</a></div>
            <div><a href="tel:+36306083283">+36306083283</a></div>
            <div style="padding-top: 2vh;">Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return emailBody;
};

exports.thanks_email_content = (reservation) => {
    const emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${reservation.name}!</h1>
            <div style="padding-bottom: 10px;">KÖSZÖNJÜK, HOGY VELÜNK JÁTSZOTTÁL!</div>
            <div style="padding-bottom: 10px;">Kedves Vendégünk! Köszönjük szépen, hogy nálunk játszottatok, reméljük, hogy csapatoddal együtt jól éreztétek magatokat és tetszett a játék!</div>        
            <div style="padding-bottom: 10px;">Fontos számunkra a visszajelzés, kérlek értekelj minket itt:</div>
            <a href="https://g.page/r/CcYr0A3xLg7FEAg/review">
              <button>Értékelés</button></a>
            <div style="padding-bottom: 30px;">Találkozzunk legközelebb is!</div>
        </div>
        <hr>
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel:</div>
            <div><a href="tel:+36208028647">+36208028647</a></div>
            <div><a href="tel:+36306083283">+36306083283</a></div>
            <div style="padding-top: 2vh;">Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return emailBody;
};

exports.client_message_create_body = (req, res, next) => {
    res.locals.emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${res.locals.messageInfo.name}!</h1>
            <div style="padding-bottom: 10px;">${res.locals.emailTitle}</div>
            <hr>
            <div style="padding-bottom: 30px; font-weight: bold;">Használt email cím: ${res.locals.messageInfo.email}</div>        
            <div style="padding-bottom: 10px; font-weight: bold;">Üzenet: </div>
            <div style="padding-bottom: 10px; text-align: center;">${res.locals.messageInfo.text}</div>
            <hr>
            <div style="padding-bottom: 30px;">Munkatársaink mihamarabb felveszik veled a kapcsolatot!</div>
        </div>
        <hr>
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel:</div>
            <div><a href="tel:+36208028647">+36208028647</a></div>
            <div><a href="tel:+36306083283">+36306083283</a></div>
            <div style="padding-top: 2vh;">Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return next();
};

exports.admin_message_create_body = (req, res, next) => {
    res.locals.emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Új üzenet érkezett!</h1>
            <hr>
            <h2 style="padding-bottom: 30px;">Adatok:</h2>
            <div style="padding-bottom: 10px;">Email cím: </div>
            <div style="padding-bottom: 10px;">${res.locals.messageInfo.email}</div>
            <div style="padding-bottom: 10px;">Név: </div>
            <div style="padding-bottom: 10px;">${res.locals.messageInfo.name}</div>     
            <div style="padding-bottom: 10px;">Üzenet: </div>
            <div style="padding-bottom: 10px; text-align: center;">${res.locals.messageInfo.text}</div>
            <hr>
            <div style="padding-top: 30px; padding-bottom: 30px;">
            <a href="http://www.gyenespaintball.hu/operators/messages">
              <button>Válaszolok</button>
            </a>
            </div>
        </div>
    `;
    return next();
};

exports.client_message_reply_body = (req, res, next) => {
    res.locals.emailBody = `
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${res.locals.messageInfo.name}!</h1>
            <div style="padding-bottom: 5px; text-align: left;">${res.locals.replyBody}</div>
		<div style="padding-bottom: 10px; text-align: left;">Üdv.: Gyenespaintball csapata</div>
            <hr>
            <div style="padding-top: 30px; padding-bottom: 10px;">Eredeti üzenet: </div>
            <div style="padding-bottom: 10px; text-align: center;">${res.locals.messageInfo.text}</div>
        </div>
        <hr>
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel:</div>
            <div><a href="tel:+36208028647">+36208028647</a></div>
            <div><a href="tel:+36306083283">+36306083283</a></div>
            <div style="padding-top: 2vh;">Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return next();
};
