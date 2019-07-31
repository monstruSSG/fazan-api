module.exports = socket => {
    socket.on('pingEvent', (data) => {
        console.log('ping received', data)
        socket.emit('pongEvent', {
            oponentWord: data.word + "ceau"
        })
    })
}