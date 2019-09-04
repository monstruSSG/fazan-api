const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const authLogic = require('../api/v1/auth/logic');
const {
    invalidAuthHeader,
    invalidToken,
    badCredentials
} = require('../utils/constants/errorMessages')


checkAutorisation = async authorisation => {
    //header template: Bearer {token}
    let splittedHeader = authorisation.split(' ');
    if (splittedHeader.length) {
        let token = splittedHeader[1];
        try {
            let decoded = await jwt.verify(token, process.env.JWT_SECRET);
            if (await authLogic.findUserById(decoded.userId)) {
                return {
                    status: httpStatus.OK,
                    userId: decoded.userId
                }
            }
            return {
                status: httpStatus.UNAUTHORIZED,
                message: badCredentials
            };
        } catch (error) {
            return {
                status: httpStatus.UNAUTHORIZED,
                message: invalidToken,
                error
            }
        }
    }
}

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
    isLoggedHttp: (req, res, next) => {
        if (!req.headers.authorisation) {
            return res.err({
                status: httpStatus.UNAUTHORIZED,
                message: invalidAuthHeader
            });
        }
        let authorisationResponse = checkAutorisation(req.headers.authorisation)
        if (authorisationResponse.status === httpStatus.OK) {
            req.userId = authorisationResponse.userId
            return next()
        }
        return res.err(authorisationResponse)
    },
    isLoggedSocket: (socket, next) => {
        if (!socket.handshake.query || !socket.handshake.query.authorisation) {
            return next(new Error({
                status: httpStatus.UNAUTHORIZED,
                message: invalidAuthHeader
            }));
        }
        let authorisationResponse = checkAutorisation(socket.handshake.query.authorisation)
        if (authorisationResponse.status === httpStatus.OK) {
            socket.userId = authorisationResponse.userId
            return next()
        }
        return next(new Error(authorisationResponse))
    }
};