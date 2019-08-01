const invitationHandler = require('./invitation/invitation');
const pingHandler = require('./ping/ping');


module.exports = io => {
    //general namespace
    io.on('connection', socket => {
        console.log('user connected');

        pingHandler(socket);
        invitationHandler(socket);

        socket.on('disconnect', socket => {
            console.log('user disconnected');
        })
    })
}