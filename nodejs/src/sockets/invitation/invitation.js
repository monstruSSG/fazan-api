const usersLogic = require('../../api/v1/user/logic');
const { busy } = require('../../utils/constants/app');


module.exports = socket => {
    socket.on('invitationSent', data => {
        console.log(`Received invitation request for: ${data.socketId}`);

        global.io.to(data.socketId).emit('invitationReceived', { socketId: socket.id });
    })

    socket.on('invitationAccepted', data => {
        console.log(`Invitation accepted by: ${socket.id}`);

        //send 'startGame' to both players
        global.io.to(data.socketId).emit('startGame', { socketId: socket.id });
        global.io.to(socket.id).emit('startGame', { socketId: data.socketId });

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