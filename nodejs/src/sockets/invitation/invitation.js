<<<<<<< HEAD
const wordLogic = require('../../api/v1/word/logic')
<<<<<<< Updated upstream
=======
const usersLogic = require('../../api/v1/user/logic');
const { busy } = require('../../utils/constants/app');
>>>>>>> 007982d8f1e0ad5e43c54678676088d3a8ff2e26
=======
const usersLogic = require('../../api/v1/user/logic')
>>>>>>> Stashed changes


module.exports = (io, socket) => {
    socket.on('invitationSent', data => {
        console.log(`Received invitation request for: ${data.socketId}`);

        io.to(data.socketId).emit('invitationReceived', { socketId: socket.id });
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`);

<<<<<<< Updated upstream
<<<<<<< HEAD
        //send 'startGame' to both players, but only one
        //who was invited gets the starting word
        wordLogic.getRandomValidWord().then(word => {
            io.to(data.socketId).emit('startGame', { socketId: socket.id })
            io.to(socket.id).emit('startGame', { socketId: data.socketId, word })
        })
=======
        //send 'startGame' to both players
        io.to(data.socketId).emit('startGame', { socketId: socket.id });
        io.to(socket.id).emit('startGame', { socketId: data.socketId });
=======
        //send 'startGame' to both players
        io.to(data.socketId).emit('startGame', { socketId: socket.id, turn: false });
        io.to(socket.id).emit('startGame', { socketId: data.socketId, turn: true });
>>>>>>> Stashed changes

        //set users as being busy
        Promise.all([
            usersLogic.update(socket.userId,
                {
                    status: busy
                }
            ),
            usersLogic.update(session.userId,
                {
                    status: busy
                }
            )
        ])
<<<<<<< Updated upstream
>>>>>>> 007982d8f1e0ad5e43c54678676088d3a8ff2e26
=======
>>>>>>> Stashed changes
    })

    socket.on('invitationDeclined', data => {
        console.log(`Invitation declined by: ${socket.id}`);
        io.to(data.socketId).emit('invitationDeclined', { socketId: socket.id });
    })
}