module.exports = socket => {
    socket.on('invitationSent', data => {
        console.log(`Received: ${data}`)
        socket.emit('invitationAccepted', { message: 'pingPong' })
    })

    socket.on('inviatationAccepted', data => {

    })
}