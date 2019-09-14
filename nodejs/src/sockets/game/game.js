const moment = require('moment');
const wordLogic = require('../../api/v1/word/logic');
const gameHistoryLogic = require('../../api/v1/gameHistory/logic');
const userLogic = require('../../api/v1/user/logic');
const { won, lost, available } = require('../../utils/constants/app');


module.exports = (io, socket) => {
    socket.on('sendWord', data => {
        //check if oponent just lost 
        wordLogic.checkWordSubstring(data.word).then(() => //word exists
            io.to(data.socketId).emit('gotWord', {
                word: data.word,
                socketId: data.socketId
            })
        ).catch(() => {
            //async send sockets
            io.to(data.socketId).emit('gameOver', {
                word: data.word
            })
            io.to(socket.id).emit('youWon', {
                word: data.word
            })
            return userLogic.find({ socketId: data.socketId }).then(user => {
                if (!user) return Promise.reject({ message: 'User does not exists ' })
                //log outcome
                return Promise.all([
                    //oponent lost
                    gameHistoryLogic.create({
                        user: user._id,
                        outcome: lost,
                        dateTime: moment().toISOString()
                    }),
                    //you won
                    gameHistoryLogic.create({
                        user: socket.userId,
                        outcome: won,
                        dateTime: moment().toISOString()
                    }),
                    //increase wins and make user available again
                    userLogic.update(
                        socket.id,
                        {
                            "$inc": {
                                wins: 1
                            },
                            status: available
                        }
                    ),
                    //increase loses and make user available again
                    userLogic.update(
                        socket.userId,
                        {
                            "$inc": {
                                loses: 1
                            },
                            status: available
                        }
                    )
                ])
            })
        })
    })
}