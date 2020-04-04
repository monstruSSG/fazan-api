const jwt = require('jsonwebtoken')
const moment = require('moment')
const httpStatus = require('http-status')
const axios = require('axios')

const database = require('./database')
const { facebookBaseUrl, facebookGetDataUrl } = require('../../../../config/defaults')


let logic = {
    fbLogin: async ({ fbToken, deviceId }) => {
        // Test if fbToken is valid
        await axios.get(`${facebookBaseUrl}?access_token=${fbToken}`)
        let { data } = await axios.get(`${facebookGetDataUrl}/me?fields=name,short_name,picture&access_token=${fbToken}`)

        let user = await database.findOne({ facebookId: data.id })

        if (!user) {
            let createdUser = await database.create({
                username: data.name,
                deviceId,
                shortName: data.short_name,
                pictureUrl: data.picture.data.url,
                facebookId: data.id,
            })

            return {
                user: createdUser,
                token: jwt.sign({
                    userId: createdUser._id,
                    timestamp: moment().format()
                }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
            }
        }

        let token = jwt.sign({
            userId: user._id,
            timestamp: moment().format()
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })

        if (user.deviceId !== deviceId) {
            await database.findUserByIdAndUpdate(user._id, { deviceId })
        }

        return {
            user,
            token
        }
    },
    gmailLogin: async ({ gmailToken, id, deviceId }) => {
        let user = await database.findOne({ googleId: id });

        if (!user) {
            let userInfo = jwt.decode(gmailToken);

            let newUser = await database.create({
                username: userInfo.given_name,
                shortName: userInfo.given_name,
                pictureUrl: userInfo.picture,
                googleId: id,
                deviceId
            });

            return {
                user: newUser,
                token: jwt.sign({
                    userId: newUser._id,
                    timestamp: moment().format()
                }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
            };
        }

        if (user.deviceId !== deviceId) {
            await database.findUserByIdAndUpdate(user._id, { deviceId })
        }

        let token = jwt.sign({
            userId: user._id,
            timestamp: moment().format()
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })

        console.log('user', user)

        return {
            user,
            token
        };

    }
}

module.exports = logic
