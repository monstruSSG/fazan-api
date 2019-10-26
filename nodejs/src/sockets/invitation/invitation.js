const usersLogic = require('../../api/v1/user/logic')
const wordsLogic = require('../../api/v1/word/logic')
const { busy } = require('../../utils/constants/app')

let invitationsList = []

let removeFromInvitations = socketId => {
    let indexOf = invitationsList.indexOf(socketId)
    if(indexOf > -1)
        invitationsList.splice(indexOf, 1)
}

let startGame = (socketId1, socketId2) => {
    //send 'startGame' to both players
    return Promise.all([
        usersLogic.findOne({ socketId: socketId1 }),
        usersLogic.findOne({ socketId: socketId2 })
    ]).then(users => {

        if (users.length !== 2) return Promise.reject({ message: 'one / more users cannot be found', users })

        //set users as being busy
        return Promise.all([
            usersLogic.update(users[0]._id,
                {
                    status: busy,
                    inGame: {
                        opponentSocketId: socketId2,
                        playing: true
                    }
                }
            ),
            usersLogic.update(users[1]._id,
                {
                    status: busy,
                    inGame: {
                        opponentSocketId: socketId1,
                        playing: true
                    }
                }
            )
        ]).then(() =>
            wordsLogic.getRandomValidWord().then(word => {
                global.io.to(socketId2).emit('startGame', { socketId: socketId1, opponentName: users[0].shortName })
                global.io.to(socketId1).emit('startGame', { socketId: socketId2, opponentName: users[1].shortName })
                global.io.to(socketId2).emit('gotWord', { word })
                global.io.to(socketId1).emit('opponentIsThinking', { word })
                removeFromInvitations(socketId1)
                removeFromInvitations(socketId2)
                return Promise.resolve({})
            })
        )
    }).catch(err => {
        console.log("Error at starting game", err)
    })
}

module.exports = socket => {

    socket.on('endPlayRandom', async () => {
        //update me as playRandom
        try {
            global.playRandomQueue.findAndRemove(socket.id)
        } catch (err) {
            console.log(err)
        }
    })

    socket.on('playRandom', async data => {
        try {
            //console.log(`Play randoom: ${data.socketId}`, data)
            if (global.playRandomQueue.getLength() === 1) {
                startGame(
                    global.playRandomQueue.dequeue(),
                    socket.id
                )
            } else {
                if (global.playRandomQueue.getLength() === 0)
                    global.playRandomQueue.enqueue(socket.id)
                else {
                    global.playRandomQueue.enqueue(socket.id)
                    startGame(
                        global.playRandomQueue.dequeue(),
                        global.playRandomQueue.dequeue()
                    )
                }
            }
        } catch (e) {
            return Promise.reject(e)
        }

    })

    socket.on('invitationSent', async data => {
        console.log(`Received invitation request for: ${data.socketId}`, data)
        if (!global.playRandomQueue.exists(data.socketId) && !invitationsList.includes(data.socketId)) {
            invitationsList.push(data.socketId)
            invitationsList.push(socket.id)
            global.io.to(data.socketId).emit('invitationReceived', { socketId: socket.id })
        }
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`)
        startGame(data, socket)
    })

    socket.on('invitationDeclined', data => {
        console.log(`Invitation declined by: ${socket.id}`)
        io.to(data.socketId).emit('invitationDeclined', { socketId: socket.id })
        removeFromInvitations(data.socketId)
        removeFromInvitations(socket.id)
    })
}