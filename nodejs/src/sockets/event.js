const invitationHandler = require('./invitation/invitation');
const pingHandler = require('./ping/ping');
const usersHandler = require('./user/user');


module.exports = io => {
    //general namespace
    io.on('connection', socket => {
        console.log('user connected');

        pingHandler(socket);
        invitationHandler(io, socket);
        usersHandler(io, socket);

        socket.on('disconnect', socket => {
            console.log('user disconnected');
        })
    })
}