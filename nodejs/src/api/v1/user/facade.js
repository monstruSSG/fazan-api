const httpStatus = require('http-status');
const userLogic = require('./logic');
const gameHistoryLogic = require('../gameHistory/logic');


module.exports = {
    getProfile: userId => Promise.all([
        userLogic.findById( userId ),
        gameHistoryLogic.find({ user: userId })
    ]).then(responses => {
        if (responses[0]) {
            return Promise.resolve({
                user: responses[0],
                gamesHistory: responses[1]
            })
        } else {
            return Promise.reject({
                status: httpStatus.NOT_FOUND
            })
        }
    }),
    getUsers: (query, limit) => userLogic.find(query, limit) 
}