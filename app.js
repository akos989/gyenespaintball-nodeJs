const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const operatorRoutes = require('./api/routes/operators');
const tempOperatorRoutes = require('./api/routes/temp_operators');
const reservationRoutes = require('./api/routes/reservations');
const NODRoutes = require('./api/routes/not_open_dates');
const packageRoutes = require('./api/routes/packages');
const packageTypeRoutes = require('./api/routes/package-type');
const modalRoutes = require('./api/routes/modals');
const messageRoutes = require('./api/routes/messages');

const whitelist = [
    'http://gyenespaintball.hu',
    'http://www.gyenespaintball.hu',
    'https://gyenespaintball.hu',
    'https://www.gyenespaintball.hu',
    'http://gyenespaintball.hu:80'
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log('CORS origin:', origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
            console.log('Allowed by CORS')
        } else {
            callback(new Error('Not allowed by CORS'));
            console.log('Not allowed by CORS')
        }
    }
}
app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes to handle
app.use('/api/temp_operators', tempOperatorRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/no_dates', NODRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/modals', modalRoutes);
app.use('/api/packages_type', packageTypeRoutes);
app.use('/api/messages', messageRoutes);
app.get('/favicon.ico', (req, res) => res.status(204));

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
