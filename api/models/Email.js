const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const emailHost = 'mail.gyenespaintball.hu';
const emailUser = 'kapcsolat@gyenespaintball.hu';
const emailPassword = 'Gyenes1230';
const emailPort = 465;

module.exports = class Email {
    send(emailOptions) {
        if (emailOptions.receiver &&
            emailOptions.subject &&
            emailOptions.template &&
            emailOptions.context) {
            const transporter = this.createTransporter();
            transporter.use('compile', hbs(this.handlebarOptions));

            transporter.sendMail(emailOptions.getMailOptions(), (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
            });
        } else {
            console.log('Some required parameters are not present', emailOptions);
        }
    }

    createTransporter() {
        return nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    handlebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve(__dirname, "..", "..", "views"),
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, "..", "..", "views"),
        extName: ".handlebars"
    }
}
