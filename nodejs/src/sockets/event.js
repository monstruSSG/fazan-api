const invitationHandler = require('./invitation/invitation')
const pingHandler = require('./ping/ping')
const usersHandler = require('./user/user')
const gameHandler = require('./game/game')

const usersLogic = require('../api/v1/user/logic')
const constants = require('../utils/constants/app')

let disconnectUser = async socket => {
    if (socket.userId) {
        let user = await usersLogic.update({ _id: socket.userId }, {
            status: constants.available,
            playRandom: false,
            inGame: {
                playing: false,
                opponentSocketId: ''
            }
        })

        global.io.to(user.inGame.opponentSocketId).emit('opponentDisconnected')
    }
}

module.exports = () => {
    //general namespace
    global.io.on('connection', async socket => {
        console.log('user connected')
        //update socketId to user
        try {
            await usersLogic.update(socket.userId, {
                socketId: socket.id,
                status: constants.available
            })
            pingHandler(socket)
            invitationHandler(socket)
            usersHandler(socket)
            gameHandler(socket)
        } catch (e) {
            //could not find user
            console.log(e)
            console.log(`Could not update socket to user ${socket.id}`)
            socket.disconnect()
        }

        //auto disconnect
        socket.on('disconnectedFromMultiplayer', () => {
            console.log('user disconnected', socket.userId)
            disconnectUser(socket)
        })

        //auto disconnect
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.userId)
            disconnectUser(socket)
        })
    })
}