const httpStatus = require('http-status');
const database = require('./database');


module.exports = {
    find: limit => database.find({}, limit),
    checkWordSubstring: word => database.findOne({ word: { $regex: `/^${word.slice(-2)}/` } }) //find word starting with ending two letters of given word
        .then(word => {
            //word not found, game over
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    check: word => database.findOne({ word })
        .then(word => {
            //word not found
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    createMany: database.createMany,
    create: database.create,
}