const moment = require('moment')
const wordLogic = require('../../api/v1/word/logic')
const gameHistoryLogic = require('../../api/v1/gameHistory/logic')
const userLogic = require('../../api/v1/user/logic')
const { won, lost, available } = require('../../utils/constants/app')


let gameOver = async data => {
    //async send sockets
    let wonSocketId = data.wonSocketId
    let wonUserId = data.wonUserId
    let lostSocketId = data.lostSocketId
    let lostUserId = data.lostUserId

    global.io.to(lostSocketId).emit('gameOver', {
        word: data.word,
        alternative: data.alternative ? data.alternative : null
    })

    global.io.to(wonSocketId).emit('youWon', {
        word: data.word,
        ...data.reason
    })

    //log outcome
    return Promise.all([
        //opponent lost
        gameHistoryLogic.create({
            user: lostUserId,
            opponent: wonUserId,
            outcome: lost,
            dateTime: moment().toISOString()
        }),
        //you won
        gameHistoryLogic.create({
            user: wonUserId,
            opponent: lostUserId,
            outcome: won,
            dateTime: moment().toISOString()
        }),
        //increase wins and make user available again
        userLogic.update(
            wonUserId,
            {
                "$inc": {
                    wins: 1
                },
                status: available,
                inGame: {
                    playing: false,
                    opponentSocketId: ''
                }
            }
        ),
        //increase loses and make user available again
        userLogic.update(
            lostUserId,
            {
                "$inc": {
                    loses: 1
                },
                status: available,
                inGame: {
                    playing: false,
                    opponentSocketId: ''
                }
            }
        )
    ])
}

let getUsersBySocketIds = socketIds => Promise.all([
    ...socketIds.map(socketId => userLogic.findOne({ socketId }))
])

module.exports = socket => {
    socket.on('exitGame', data => {
        getUsersBySocketIds([data.socketId, socket.id]).then(users => {
            gameOver({
                lostSocketId: socket.id,
                wonSocketId: data.socketId,
                lostUserId: users[1]._id,
                wonUserId: users[0]._id,
                word: data.word,
                reason: {
                    opponentDisconnected: true
                }
            })
        })
    })

    socket.on('iLost', data => {
        getUsersBySocketIds([data.socketId, socket.id]).then(async users => {
            let alternatives = await wordLogic.checkWordSubstring(data.word)
            gameOver({
                lostSocketId: socket.id,
                wonSocketId: data.socketId,
                lostUserId: users[1]._id,
                wonUserId: users[0]._id,
                word: data.word,
                reason: {
                    timeExpired: true
                },
                alternative: alternatives.word
            })
        })
    })

    socket.on('sendWord', data => {
        //check if opponent just lost 
        wordLogic.checkWordSubstring(data.word.toLowerCase()).then(() => {  //word exists
            global.io.to(data.socketId).emit('gotWord', {
                word: data.word,
                socketId: data.socketId
            })
        }).catch(() => {
            getUsersBySocketIds([data.socketId, socket.id]).then(users => {
                gameOver({
                    lostSocketId: data.socketId,
                    wonSocketId: socket.id,
                    lostUserId: users[0]._id,
                    wonUserId: users[1]._id,
                    word: data.word,
                    reason: {
                        opponentDisconnected: false,
                        timeExpired: false
                    }
                })
            })
        })
    })
}