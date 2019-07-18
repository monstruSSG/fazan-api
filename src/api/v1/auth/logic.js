const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const statusCodes = require('http-status');
const database = require('./database');
const {
    cantCreateToken
} = require('../../../utils/constants/errorMessages')


let logic = {
    createToken: userId => {
        try {
            //added timestamp for randomness
            let token = jwt.sign({ userId, timestamp: moment().format() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            return Promise.resolve(token);
        } catch (error) {
            return Promise.reject({
                status: statusCodes.BAD_REQUEST,
                message: cantCreateToken,
                error
            });
        }
    },
    login: user => {
        const hash = crypto.createHash(process.env.CRYPTO_ALG).update(user.password).digest(process.env.CRYPTO_OUTPUT);
        return database.findOne({ username: user.username, password: hash })
            .then(user => logic.createToken(user._id))
            .then(token => Promise.resolve({
                status: statusCodes.OK,
                token
            }));
    },
    register: user => {
        const hash = crypto.createHash(process.env.CRYPTO_ALG).update(user.password).digest(process.env.CRYPTO_OUTPUT);
        return database.create({ ...user, password: hash })
            .then(createdUser => logic.createToken(createdUser._id))
            .then(token => Promise.resolve({
                status: statusCodes.OK,
                token
            }))
    },
    findUserById: database.findUserById
}

module.exports = logic;