const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const operatorRoutes = require('./api/routes/operators');
const tempOperatorRoutes = require('./api/routes/temp_operators');
const reservationRoutes = require('./api/routes/reservations');
const NODRoutes = require('./api/routes/not_open_dates');
const subscriptionRoutes = require('./api/routes/subscriptions');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes to handle
app.use('/operators', operatorRoutes);
app.use('/temp_operators', tempOperatorRoutes);
app.use('/reservations', reservationRoutes);
app.use('/no_dates', NODRoutes);
app.use('/subscriptions', subscriptionRoutes);


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