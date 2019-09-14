const httpStatus = require('http-status');
const userLogic = require('./logic');
const gameHistoryLogic = require('../gameHistory/logic');


module.exports = {
    getProfile: userId => Promise.all([
        userLogic.findById(userId),
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
    search: term => {
        let connectedSockets = Object.keys(global.io.sockets.connected).filter(socketId => socketId !== socket.id);
        let usersList = []
        try {
            usersList = await userLogic.find({
                socketId: connectedSockets,
                status: available,
                shortName: { $regex: new RegExp(`^${term}`) }
            });
        } catch (e) {
            return Promise.reject(e);
        }
        return Promise.resolve({ users: usersList })
    },
    getUsers: (query, limit) => userLogic.find(query, limit)
}