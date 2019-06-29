const express = require('express');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const helmet = require('helmet');

const CONFIG = require('./config/defaults');
const { notFound, errorHandler } = require('./src/utils/middlewares');

const app = express();

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

app.get('/', (req, res, next) => res.send('Example'));

app.use(notFound);

app.use(errorHandler);

app.listen(CONFIG.PORT,
    () => console.log(`App listening on port ${CONFIG.PORT}`));

