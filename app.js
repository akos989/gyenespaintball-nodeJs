const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const operatorRoutes = require('./api/routes/operators');
const tempOperatorRoutes = require('./api/routes/temp_operators');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes to handle
app.use('/operators', operatorRoutes);
app.use('/temp_operators', tempOperatorRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;