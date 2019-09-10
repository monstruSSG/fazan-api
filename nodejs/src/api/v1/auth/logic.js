const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const httpStatus = require('http-status');
const database = require('./database');
const {
    cantCreateToken
} = require('../../../utils/constants/errorMessages');
const { facebookBaseUrl } = require('../../../../config/defaults');
const axios = require('axios');

let logic = {
    createToken: userId => {
        try {
            //added timestamp for randomness
            let token = jwt.sign({ userId, timestamp: moment().format() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            return Promise.resolve(token);
        } catch (error) {
            return Promise.reject({
                status: httpStatus.BAD_REQUEST,
                message: cantCreateToken,
                error
            });
        }
    },
    login: data => {
        console.log(data, 'DATA')
        return axios.get(`https://graph.facebook.com/app?access_token=${data.fbToken}`)
            .then(res => console.log(res.data, 'RESPONS'))
            .catch(err => console.log(err, 'eRoare'))
    },
    register: user => {
        const hash = crypto.createHash(process.env.CRYPTO_ALG).update(user.password).digest(process.env.CRYPTO_OUTPUT);
        return database.create({ ...user, password: hash })
            .then(createdUser => logic.createToken(createdUser._id))
            .then(token => Promise.resolve({
                status: httpStatus.OK,
                token
            }))
    },
    findUserById: database.findUserById
}

module.exports = logic;