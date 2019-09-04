const moment = require('moment');
const wordLogic = require('../../api/v1/word/logic');
const gameHistoryLogic = require('../../api/v1/gameHistory/logic');
const userLogic = require('../../api/v1/user');
const { won, lost, available } = require('../../utils/constants/app');


module.exports = (io, socket) => {
    socket.on('inGame', data => console.log(data, 'IN_GAME'))

    socket.on('sendWord', data => {

        //check if oponent just lost 
        console.log(data)
        wordLogic.checkWordSubstring(data.word).then(() => //word exists
            io.to(data.socketId).emit('gotWord', {
                word: data.word,
                socketId: socket.id
            })
        ).catch(() => {

            //async send sockets
            io.to(data.socketId).emit('gameOver', {
                word: data.word
            })
            io.to(socket.id).emit('youWon', {
                word: data.word
            })

            //log outcome
            return Promise.all([
                //oponent lost
                gameHistoryLogic.create({
                    user: data.userId,
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
}