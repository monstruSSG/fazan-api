const userLogic = require('../../api/v1/user/logic');
const { available } = require('../../utils/constants/app');

module.exports =  socket => {
    socket.on('reqConnectedUsers', async () => {
        let connectedSockets = Object.keys(global.io.sockets.connected).filter(socketId => socketId !== socket.userId); 

        try {
            let usersList =  await userLogic.find({ socketId: connectedSockets /*, status: available */ });

            //create JSON from users list / faster mapping
            let usersJson = {}
    
            usersList.forEach(user => usersJson[user.socketId] = user);
 
            //merge users with sockets
            connectedSockets = connectedSockets.map(socketId => usersJson[socketId]);
            socket.emit('recConnectedUsers', { //get all users but yourself
                users: connectedSockets
            });
        } catch (e) {
            return Promise.reject(e);
        }
    })
}