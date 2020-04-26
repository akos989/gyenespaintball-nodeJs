const nodemailer = require('nodemailer');

module.exports = (req, res, next) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sdfs", // generated ethereal user
      pass: "sdsdf" // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"Gyenespaintball" <foo@example.com>', // sender address
    to: res.locals.reservationInfo.email, // list of receivers
    subject: res.locals.emailSubject, // Subject line
    text: "Hello world?", // plain text body
    html: res.locals.emailBody // html body
  };
  console.log(res.locals.emailBody);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...  
  }); 
}