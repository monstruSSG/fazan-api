const httpStatus = require('http-status')
const userLogic = require('./logic')
const gameHistoryLogic = require('../gameHistory/logic')
const { available } = require('../../../utils/constants/app')


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
    getConnected: async (params, sessionUserId) => {
        let connectedSockets = Object.keys(global.io.sockets.connected)
        let playRandomArray = global.playRandomQueue.getArray()
    
        try {
            let usersList = []
            if (!params.search.length)
                usersList = await userLogic.find({
                    socketId: connectedSockets,
                    $and: [
                        {_id: { $ne: sessionUserId }},
                        {_id: { $nin: playRandomArray }}
                    ],
                    status: available,
                }, { from: params.from, limit: params.limit })
            else {
                usersList = await userLogic.find({
                    socketId: connectedSockets,
                    status: available,
                    $and: [
                        {_id: { $ne: sessionUserId }},
                        {_id: { $nin: playRandomArray }}
                    ],
                    shortName: { $regex: new RegExp(`^${params.search.toLowerCase()}`, 'i') }
                }, { from: params.from, limit: params.limit })
            }

            //create JSON from users list / faster mapping
            let usersJson = {}

            usersList.forEach(user => usersJson[user.socketId] = user)

            //merge users with sockets
            connectedSockets = connectedSockets.map(socketId => usersJson[socketId]).filter(socketId =>
                socketId &&
                usersJson._id !== sessionUserId
            )
            return Promise.resolve({ users: connectedSockets })
        } catch (e) {
            return Promise.reject(e)
        }
    }
}