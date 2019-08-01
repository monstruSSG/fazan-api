require('mocha');
const io = require('socket.io-client');
const config = require('../../config');


describe('Test if socket connection is alive', function () {

    var socket = null;

    this.beforeAll(function (done) {
        // Setup
        socket = io.connect(`${config.host}:${config.port}`);

        socket.on('connect', () => {
            console.log('Connected to server');
            done();
        });

        socket.on('disconnect', () => {
            console.log('Could not connect to server')
        });
    });

    it('Test ping', function (done) {
        socket.emit('pingEvent', {});
        socket.on('pongEvent', () => done());
    });

});