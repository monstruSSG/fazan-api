const httpStatus = require('http-status');
const database = require('./database');


module.exports = {
    find: limit => database.find({}, limit),
    check: word => database.findOne({ word })
        .then(word => {
            //word not found
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    createMany: database.createMany,
    create: database.create,
}