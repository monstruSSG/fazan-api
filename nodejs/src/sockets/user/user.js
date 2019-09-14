const userLogic = require('../../api/v1/user/logic');
const { available } = require('../../utils/constants/app');

module.exports =  socket => {
    socket.on('reqConnectedUsers', async () => {
        let connectedSockets = Object.keys(global.io.sockets.connected).filter(socketId => socketId !== socket.id);

        try {
            let usersList = await userLogic.find({ socketId: connectedSockets, status: available });

            //create JSON from users list / faster mapping
            let usersJson = {}
            usersList.foreach(user => usersJson[user.socketId] = user);

            //merge users with sockets
            let connectedSockets = connectedSockets.map(socketId => usersJson[socketId]);
        } catch (e) {
            return Promise.reject(e);
        }

        socket.emit('recConnectedUsers', { //get all users but yourself
            users: connectedSockets
        });
    })
}