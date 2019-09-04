const httpStatus = require('http-status');
const database = require('./database');


module.exports = {
    find: (query, limit) => database.find(query, limit),
    update: (userId, query) => database.update(userId, query)
}