"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server = require('http').createServer();
var io = require('socket.io')(server, { pingTimeout: 60000, pingInterval: 4000 });
io.on('connection', function (socket) {
    console.log('socket connect...', socket.id);
    socket.on('summonEvent', function (data) {
        console.log(data);
        socket.broadcast.emit('summonEvent', data);
    });
    socket.on('removeCardEvent', function (data) {
        console.log(data);
        socket.broadcast.emit('removeCardEvent', data);
    });
    socket.on('disconnect', function () {
        console.log('socket disconnect...', socket.id);
    });
    socket.on('error', function (err) {
        console.log('received error from socket:', socket.id);
        console.log(err);
    });
});
var server_port = process.env.PORT || 8080;
server.listen(server_port, function (err) {
    if (err)
        throw err;
    console.log('Listening on port %d', server_port);
});
