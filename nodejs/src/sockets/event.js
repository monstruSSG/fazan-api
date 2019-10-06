const invitationHandler = require('./invitation/invitation');
const pingHandler = require('./ping/ping');
const usersHandler = require('./user/user');
const gameHandler = require('./game/game');

const usersLogic = require('../api/v1/user/logic');
const constants = require('../utils/constants/app')


module.exports = () => {
    //general namespace
    global.io.on('connection', async socket => {
        console.log('user connected')
        //update socketId to user
        try {
            await usersLogic.update(socket.userId, {
                 socketId: socket.id
            })
            pingHandler(socket);
            invitationHandler(socket);
            usersHandler(socket);
            gameHandler(socket);
        } catch (e) {
            //could not find user
            console.log(e)
            console.log(`Could not update socket to user ${socket.id}`)
            socket.disconnect();
        }
        socket.on('disconnect', async socket => {
            console.log('user disconnected');
            if(socket.userId){
                await usersLogic.update({_id: socket.userId}, {
                    status: constants.available,
                    playRandom: false
                })
            }
        })
    })
}