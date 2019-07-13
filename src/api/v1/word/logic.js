const httpStatus = require('http-status');
const database = require('./database');


module.exports = {
    find: database.find,
    check: word => database.findOne({ word })
        .then(word => {
            //word not found
            if (!word) return Promise.reject({ status: httpStatus.NOT_FOUND })
            return Promise.resolve({ status: httpStatus.OK })
        }),
    create: database.create,
}