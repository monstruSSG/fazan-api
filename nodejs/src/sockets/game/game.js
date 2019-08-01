const wordLogic = require('../../api/v1/word/logic')


module.exports = (io, socket) => {
    socket.on('sendWord', data => {

        //check if oponent just lost 
        wordLogic.checkWordSubstring(data.word).then(() => //word exists
            io.to(data.socketId).emit('gotWord', {
                word: data.word,
                socketId: data.socketId
            })
        ).catch(() => io.to(data.socketId).emit('gameOver', {
            word: data.word,
            socketId: data.socketId
        }))
    })
}