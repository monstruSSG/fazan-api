const moment = require('moment');
const wordLogic = require('../../api/v1/word/logic');
const gameHistoryLogic = require('../../api/v1/gameHistory/logic');
const userLogic = require('../../api/v1/user/logic');
const { won, lost, available } = require('../../utils/constants/app');


module.exports = socket => {
    socket.on('sendWord', data => {
        //check if opponent just lost 
        wordLogic.check(data.word).then(() => {
            wordLogic.checkWordSubstring(data.word.toLowerCase()).then(() => {  //word exists
                global.io.to(data.socketId).emit('gotWord', {
                    word: data.word,
                    socketId: data.socketId
                })
            }).catch(() => {
                //async send sockets
                global.io.to(data.socketId).emit('gameOver', {
                    word: data.word
                })
                global.io.to(socket.id).emit('youWon', {
                    word: data.word
                })
                return userLogic.findOne({ socketId: data.socketId }).then(user => {
                    if (!user) return Promise.reject({ message: 'User does not exists ' })
                    //log outcome
                    return Promise.all([
                        //opponent lost
                        gameHistoryLogic.create({
                            user: user._id,
                            opponent: socket.userId,
                            outcome: lost,
                            dateTime: moment().toISOString()
                        }),
                        //you won
                        gameHistoryLogic.create({
                            user: socket.userId,
                            opponent: user._id,
                            outcome: won,
                            dateTime: moment().toISOString()
                        }),
                        //increase wins and make user available again
                        userLogic.update(
                            socket.userId,
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
                            user._id,
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
                    ]).catch(err => {
                        console.log("ERROR", err)
                    })
                })
            })
        }).catch(() => {
            global.io.to(socket.id).emit('wordNotExists', {
                word: data.word
            })
        })
    })
}