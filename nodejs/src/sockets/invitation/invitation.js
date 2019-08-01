const wordLogic = require('../../api/v1/word/logic')


module.exports = (io, socket) => {
    socket.on('invitationSent', data => {
        console.log(`Received invitation request for: ${data.socketId}`)

        io.to(data.socketId).emit('invitationReceived', { socketId: socket.id })
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`)

        //send 'startGame' to both players, but only one
        //who was invited gets the starting word
        wordLogic.getRandomValidWord().then(word => {
            io.to(data.socketId).emit('startGame', { socketId: socket.id })
            io.to(socket.id).emit('startGame', { socketId: data.socketId, word })
        })
    })

    socket.on('invitationDeclined', data => {
        console.log(`Invitation declined by: ${socket.id}`)
        io.to(data.socketId).emit('invitationDeclined', { socketId: socket.id })
    })
}