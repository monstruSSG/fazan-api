const wordLogic = require('../../api/v1/word/logic')
const { busy } = require('../../utils/constants/app');
const usersLogic = require('../../api/v1/user/logic');


module.exports = (io, socket) => {
    socket.on('invitationSent', data => {
        console.log(`Received invitation request for: ${data.socketId}`);

        io.to(data.socketId).emit('invitationReceived', { socketId: socket.id });
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`);

        //send 'startGame' to both players, but only one
        //who was invited gets the starting word
        wordLogic.getRandomValidWord().then(word => {
            io.to(data.socketId).emit('startGame', { socketId: socket.id })
            io.to(socket.id).emit('startGame', { socketId: data.socketId, word })
        })

        //send 'startGame' to both players
        io.to(data.socketId).emit('startGame', { socketId: socket.id });
        io.to(socket.id).emit('startGame', { socketId: data.socketId });

        //send 'startGame' to both players
        io.to(data.socketId).emit('startGame', { socketId: socket.id, turn: false });
        io.to(socket.id).emit('startGame', { socketId: data.socketId, turn: true });


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
    })

    socket.on('invitationDeclined', data => {
        console.log(`Invitation declined by: ${socket.id}`);
        io.to(data.socketId).emit('invitationDeclined', { socketId: socket.id });
    })
}