const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const authLogic = require('../api/v1/auth/logic');
const {
    invalidAuthHeader,
    invalidToken,
    badCredentials
} = require('../utils/constants/errorMessages')


module.exports = {
    notFound: (req, res, next) => {
        let err = new Error('Not found');
        err.status = httpStatus.NOT_FOUND;
        next(err);
    },
    errorHandler: (err, req, res, next) => {
        console.log(err)
        res.status(err.status || httpStatus.BAD_REQUEST);
        res.json({ error: err });
    },
    isLogged: async (req, res, next) => {
        if (!req.headers.authorisation) {
            return res.err({
                status: httpStatus.UNAUTHORIZED,
                message: invalidAuthHeader
            });
        }
        //header template: Bearer {token}
        let splittedHeader = req.headers.authorisation.split(' ');
        if (splittedHeader.length) {
            let token = splittedHeader[1];
            try {
                let decoded = await jwt.verify(token, process.env.JWT_SECRET);
                if (await authLogic.findUserById(decoded.userId)) {
                    req.userId = decoded.userId;
                    return next();
                }
                return res.err({
                    status: httpStatus.UNAUTHORIZED,
                    message: badCredentials
                });
            } catch (error) {
                return res.err({
                    status: httpStatus.UNAUTHORIZED,
                    message: invalidToken,
                    error
                });
            }
        }
    }
};