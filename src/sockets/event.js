const invitationHandler = require('./invitation/invitation');


module.exports = io => {
    //general namespace
    io.on('connection', socket => {
        console.log('user connected');

        invitationHandler(socket);

        socket.on('disonnect', socket => {

        })
    })
}