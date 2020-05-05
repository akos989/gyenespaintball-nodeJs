const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const operatorRoutes = require('./api/routes/operators');
const tempOperatorRoutes = require('./api/routes/temp_operators');
const reservationRoutes = require('./api/routes/reservations');
const NODRoutes = require('./api/routes/not_open_dates');
const subscriptionRoutes = require('./api/routes/subscriptions');
const packageRoutes = require('./api/routes/packages');
const packageTypeRoutes = require('./api/routes/package-type');
const modalRoutes = require('./api/routes/modals');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes to handle
app.use('/api/temp_operators', tempOperatorRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/no_dates', NODRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/modals', modalRoutes);
app.use('/api/packages_type', packageTypeRoutes);

let reporter = function (type, ...rest)
{
	// remote reporter logic goes here
};

/* handle an uncaught exception & exit the process */
process.on('uncaughtException', function (err)
{
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);

	reporter("uncaughtException", (new Date).toUTCString(), err.message, err.stack);

	process.exit(1);
});

/* handle an unhandled promise rejection */
process.on('unhandledRejection', function (reason, promise)
{
	console.error('unhandled rejection:', reason.message || reason);

	reporter("uncaughtException", (new Date).toUTCString(), reason.message || reason);
})


app.use((req, res, next) => {

    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, res, next) => {

    res.status(error.status || 500).json({
        error: {
            error: 'NOT_FOUND',
            message: error.message
        }
    });
});

module.exports = app;
