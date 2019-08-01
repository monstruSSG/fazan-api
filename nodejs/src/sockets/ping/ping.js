module.exports = socket => {
    socket.on('pingEvent', () => {
        console.log('ping received')
        socket.emit('pongEvent')
    })
}