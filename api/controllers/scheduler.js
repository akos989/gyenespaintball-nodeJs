const schedule = require('node-schedule');
const EmailController = require('../controllers/email');

exports.new_reservation = (req, res, next) => {
    var date = new Date(2020, 4, 13, 0, 18, 40);
    console.log(date);
    var x = 'Tada!';
    var j = schedule.scheduleJob(date, function(y){
        EmailController.client_reservaion_email
        console.log(y);
    }.bind(null,res.locals.reservationInfo));
    x = 'Changing Data';
    return next();
};