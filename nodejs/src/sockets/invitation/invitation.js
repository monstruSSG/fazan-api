const usersLogic = require('../../api/v1/user/logic')
const wordsLogic = require('../../api/v1/word/logic')
const { busy, available } = require('../../utils/constants/app')
const helpers = require('../../utils/helpers')


let startGame = (data, socket) => {
    //send 'startGame' to both players
    return Promise.all([
        usersLogic.findOne({ socketId: socket.id }),
        usersLogic.findOne({ socketId: data.socketId })
    ]).then(users => {

        if (users.length !== 2) return Promise.reject({ message: 'one / more users cannot be found', users })

        //set users as being busy
        let currentUser = users[0]
        return Promise.all([
            usersLogic.update(socket.userId,
                {
                    status: busy,
                    inGame: {
                        opponentSocketId: data.socketId,
                        playing: true
                    }
                }
            ),
            usersLogic.update(currentUser._id,
                {
                    status: busy,
                    inGame: {
                        opponentSocketId: socket.id,
                        playing: true
                    }
                }
            )
        ]).then(() =>
            wordsLogic.getRandomValidWord().then(word => {
                global.io.to(data.socketId).emit('startGame', { socketId: socket.id, opponentName: users[1].shortName })
                global.io.to(socket.id).emit('startGame', { socketId: data.socketId, opponentName: users[0].shortName })
                global.io.to(socket.id).emit('gotWord', { word })
                global.io.to(data.socketId).emit('opponentIsThinking', { word })
                return Promise.resolve({})
            })
        )
    }).catch(err => {
        console.log("Error at starting game", err)
    })
}

module.exports = socket => {
    socket.on('playRandom', async data => {
        try {
            //console.log(`Play randoom: ${data.socketId}`, data)

            //get connected users
            let connectedSockets = Object.keys(global.io.sockets.connected).filter(socketId => socketId !== socket.id)

            let connectedUsers = await usersLogic.find({ socketId: connectedSockets /*status: available*/ })


            //update me as playRandom
            await usersLogic.update({ _id: socket.userId }, { $set: { playRandom: true, status: busy } })

            //check if there's another user which plays random
            let disponibleUsers = helpers.shuffle([...connectedUsers])
            let playRandomUsers = disponibleUsers.filter(user => user.playRandom)
            if (playRandomUsers.length) {
                startGame(
                    { socketId: playRandomUsers[0].socketId },
                    socket
                )
            } else {
                global.io.to(socket.id).emit('playRandomFailed', {})
            }
        } catch (e) {
            return Promise.reject(e)
        }

    })
    socket.on('invitationSent', data => {
        console.log(`Received invitation request for: ${data.socketId}`, data)

        global.io.to(data.socketId).emit('invitationReceived', { socketId: socket.id })
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`)
        startGame(data, socket)
    })

    socket.on('invitationDeclined', data => {
        console.log(`Invitation declined by: ${socket.id}`)
        io.to(data.socketId).emit('invitationDeclined', { socketId: socket.id })
    })
}