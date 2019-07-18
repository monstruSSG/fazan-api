const statusCodes = require('http-status');

module.exports = {
    notFound: (req, res, next) => {
        let err = new Error('Not found');
        err.status = statusCodes.NOT_FOUND;
        next(err);
    },
    errorHandler: (err, req, res, next) => {
        console.log(err)
        res.status(err.status || statusCodes.INTERNAL_SERVER_ERROR);
        res.json({ error: err });
    }
};