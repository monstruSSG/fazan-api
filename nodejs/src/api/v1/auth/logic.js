const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const httpStatus = require('http-status');
const axios = require('axios');

const database = require('./database');
const { cantCreateToken } = require('../../../utils/constants/errorMessages');
const { facebookBaseUrl, facebookGetDataUrl } = require('../../../../config/defaults');

let logic = {
    login: ({ fbToken }) => axios.get(`${facebookBaseUrl}?access_token=${fbToken}`)
        .then(() => axios.get(`${facebookGetDataUrl}/me?fields=name,short_name,picture&access_token=${fbToken}`))
        .then(async ({ data }) => {
            let user = await database.findOne({ facebookId: data.id })

            if (!user) {
                return database.create({
                    username: data.name,
                    shortName: data.short_name,
                    pictureUrl: data.picture.data.url,
                    facebookId: data.id
                }).then(createdUser => Promise.resolve({
                    user: createdUser, 
                    token: jwt.sign({ userId: createdUser._id, timestamp: moment().format() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
                }))
            }

            let updateUser = await database.findUserByIdAndUpdate(user._id, { 
                username: data.name,
                shortName: data.short_name,
                pictureUrl: data.picture.data.url
            }).then(updatedUser => Promise.resolve({
                user: updatedUser,
                token: jwt.sign({ userId: updatedUser._id, timestamp: moment().format() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
            }))

            return Promise.resolve(updateUser)
        })
        .then(user => Promise.resolve({ status: httpStatus.OK, user }))
}

module.exports = logic;