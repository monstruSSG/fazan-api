const express = require('express');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const app = express();

const dbConnection = require('./src/database/connection');
const { notFound, errorHandler } = require('./src/utils/middlewares');

app.use(cors());
app.use(morgan('dev')); 
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.response.__proto__.done = function (data) {
    if (data) this.status(data.status || httpStatus.OK);
    else this.status(httpStatus.NOT_FOUND);

    this.json(data);
}

app.response.__proto__.err = function (data) {
    if (!data.status) data.status = httpStatus.BAD_REQUEST;

    this.status(data.status);
    this.json(data);
}

/* Start database connection */
dbConnection().then(() => {

    //require routes
    const word = require('./src/api/v1/word/route');

    app.use('/v1/word', word);

    app.use(notFound);

    app.use(errorHandler);

    app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));
}).catch(err => {
    console.log('Could not connect to database!', err)
});