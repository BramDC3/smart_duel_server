const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', function (socket) {

    console.log('socket connect...', socket.id);

    socket.on('summonEvent', function name(data) {
        console.log(data);
        socket.broadcast.emit('summonEvent', data);
    });

    socket.on('connect', function () {
    });

    socket.on('disconnect', function () {
        console.log('socket disconnect...', socket.id);
    });

    socket.on('error', function (err) {
        console.log('received error from socket:', socket.id);
        console.log(err);
    });
});

var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
    if (err) throw err;
    console.log('Listening on port %d', server_port);
});
