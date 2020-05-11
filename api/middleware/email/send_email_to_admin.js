const nodemailer = require('nodemailer');

module.exports = (req, res, next) => {
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
  }); 
}