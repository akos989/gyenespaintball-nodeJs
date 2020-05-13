const nodemailer = require('nodemailer');
const Reservation = require('../models/reservation');

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
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.date.toISOString().slice(0,10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${res.locals.reservationInfo.date.getMinutes() < 10 ? '0'+res.locals.reservationInfo.date.getMinutes() : res.locals.reservationInfo.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.basePrice} Ft</div>
                <div style="font-weight: bold;">Ft / lövedék:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.bulletPrice} Ft</div>
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
    const date = new Date(res.locals.reservationInfo.date.getUTCFullYear(),
    res.locals.reservationInfo.date.getUTCMonth(),
    res.locals.reservationInfo.date.getUTCDate(),
    res.locals.reservationInfo.date.getUTCHours(),
    res.locals.reservationInfo.date.getUTCMinutes());
    date.setUTCMinutes(date.getUTCMinutes() - date.getTimezoneOffset());
    res.locals.date = date;
    const hour = date.getUTCHours();
    res.locals.emailBody = `
        <img src="cid:logo-png-email" alt="logo" style="width: 120px; position: relative; left: calc(50vw - 60px);">
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${res.locals.reservationInfo.name}!</h1>
            <h2 style="padding-bottom: 30px;"> ${res.locals.emailTitle} </h2>
            <div style="padding-bottom: 30px;">${res.locals.emailDetails}</div>
            <hr>
            <h2>Foglalás adatai:</h2>
            <div style="padding-bottom: 30px;">
                <div style="font-weight: bold;">Név:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.name}</div>
                <div style="font-weight: bold;">Email:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.email}</div>
                <div style="font-weight: bold;">Telefonszám:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.phoneNumber}</div>
                <div style="font-weight: bold;">Játékosszám:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.playerNumber}</div>
                <div style="font-weight: bold;">Dátum:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.date.toISOString().slice(0,10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${res.locals.reservationInfo.date.getMinutes() < 10 ? '0'+res.locals.reservationInfo.date.getMinutes() : res.locals.reservationInfo.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.basePrice} Ft</div>
                <div style="font-weight: bold;">Ft / lövedék:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.bulletPrice} Ft</div>
                <div style="font-weight: bold;">Lövedék az árban:</div>
                <div style="padding-bottom: 10px;">${res.locals.package.includedBullets} db</div>
                <div style="font-weight: bold;">Megjegyzések:</div>
                <div style="padding-bottom: 10px;">${res.locals.reservationInfo.notes ? res.locals.reservationInfo.notes : '-'}</div>
            </div>
        </div>
        <hr>  
        <div style="text-align:center;">
            <div>Gyenes</div><div style="padding-bottom: 5vh;">Paintball</div>
            <div>Balaton utca, Gyenesdiás</div><div>8315</div>
            <hr>
            <div> Tel: <a href="tel:+36208028647">+36208028647</a></div>
            <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:+36306083283">+36306083283</a></div>
            <div>Email:</div>
            <div><a href="mailto:gyenespaintball@gmail.com">gyenespaintball@gmail.com</a></div>
            <hr>
            <div style="padding-top: 5vh; padding-bottom: 5vh;">
                <a href="https://www.facebook.com/gyenespaintball" target="_blank"><span style="margin-right: 30px;"><img src="cid:facebook" alt="fb" style="height: 25px; width: 25px;"></span></a>
                <a href="https://www.instagram.com/gyenespaintball/" target="_blank"><span style="margin-left: 30px;"><img src="cid:insta" alt="insta" style="height: 25px; width: 25px;"></span></a>
            </div> 
        </div>
    `;
    return next();
    // <div style="padding-bottom: 10px;">${res.locals.reservationInfo.date.toISOString().slice(0,10)}
    //             ${(hour < 10) ? ('0' + hour) : hour}:${res.locals.reservationInfo.date.getMinutes() < 10 ? '0'+res.locals.reservationInfo.date.getMinutes() : res.locals.reservationInfo.date.getMinutes()}</div>
                
};

exports.send_to_client = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: "mail.szomato-coaching.hu",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "akos@szomato-coaching.hu", // generated ethereal user
          pass: "Jasonderuloa1" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });
    
      // send mail with defined transport object
    
      let mailOptions = {
        from: '"Gyenespaintball" <akos@szomato-coaching.hu>', // sender address
        to: res.locals.reservationInfo.email, // list of receivers
        subject: res.locals.emailSubject, // Subject line
        text: "Hello world?", // plain text body
        html: res.locals.emailBody, // html body
        attachments: [
          {
            filename: 'paintball-logo.png',
            path: process.cwd() + '/email/paintball-logo.png',
            cid: 'logo-png-email'
          },
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
        if (res.locals.adminEmail)
          return next();
      }); 
};

exports.send_to_admins = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: "mail.szomato-coaching.hu",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "akos@szomato-coaching.hu", // generated ethereal user
          pass: "Jasonderuloa1" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      // send mail with defined transport object
    
      let mailOptions = {
        from: '"Gyenespaintball" <akos@szomato-coaching.hu>', // sender address
        to: res.locals.adminEmails, // list of receivers
        subject: res.locals.emailSubject, // Subject line
        text: "Hello world?", // plain text body
        html: res.locals.emailBody
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // return next();
      });
};


exports.scheduled_email = (to, htmlBody) => {
  let transporter = nodemailer.createTransport({
      host: "mail.szomato-coaching.hu",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "akos@szomato-coaching.hu", // generated ethereal user
        pass: "Jasonderuloa1" // generated ethereal password
      },
      tls: {
          rejectUnauthorized: false
      }
    });
  
    // send mail with defined transport object
  
    let mailOptions = {
      from: '"Gyenespaintball" <akos@szomato-coaching.hu>', // sender address
      to: to, // list of receivers
      subject: "Foglalási emlékeztető", // Subject line
      text: "Hello world?", // plain text body
      html: htmlBody, // html body
      attachments: [
        {
          filename: 'paintball-logo.png',
          path: process.cwd() + '/email/paintball-logo.png',
          cid: 'logo-png-email'
        },
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
        <img src="cid:logo-png-email" alt="logo" style="width: 120px; position: relative; left: calc(50vw - 60px);">
        <div style="text-align: center;">
            <h1 style="padding-bottom: 30px;">Kedves ${reservation.name}!</h1>
            <div style="padding-bottom: 30px;"> Emlékeztetjük, hogy korábban foglalt Paintball időpontja 48 órán belül esedékes. A foglalással kapcsolatos adatokat lent megtalálja.</div>
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
                <div style="padding-bottom: 10px;">${reservation.date.toISOString().slice(0,10)}
                ${(hour < 10) ? ('0' + hour) : hour}:${reservation.date.getMinutes() < 10 ? '0'+reservation.date.getMinutes() : reservation.date.getMinutes()}</div>
                <div style="font-weight: bold;">Időtartam:</div>
                <div style="padding-bottom: 10px;">${package.duration} óra</div>
                <div style="font-weight: bold;">Alapár:</div>
                <div style="padding-bottom: 10px;">${package.basePrice} Ft</div>
                <div style="font-weight: bold;">Ft / lövedék:</div>
                <div style="padding-bottom: 10px;">${package.bulletPrice} Ft</div>
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
            <div> Tel: <a href="tel:+36208028647">+36208028647</a></div>
            <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:+36306083283">+36306083283</a></div>
            <div>Email:</div>
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