module.exports = (io, socket) => {
    socket.on('reqConnectedUsers', () => {
        socket.emit('recConnectedUsers', { //get all users but yourself
            users: Object.keys(io.sockets.connected).filter(socketId => socketId !== socket.id)
        })
    })
}