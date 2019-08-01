const wordLogic = require('../../api/v1/word/logic')


module.exports = (io, socket) => {
    socket.on('sendWord', data => {

        //check if oponent just lost 
        console.log(data)
        wordLogic.checkWordSubstring(data.word).then(() => //word exists
            io.to(data.socketId).emit('gotWord', {
                word: data.word,
                socketId: socket.id
            })
        ).catch(() => {
            io.to(data.socketId).emit('gameOver', {
                word: data.word,
                socketId: socket.id
            })
            io.to(socket.id).emit('youWon', {
                word: data.word,
                socketId: data.socketId
            })
        })
    })
}