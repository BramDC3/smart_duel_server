import { Socket } from "socket.io";

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', (socket: Socket) => {
    console.log('socket connect...', socket.id);

    socket.on('summonEvent', (data) => {
        console.log(data);
        socket.broadcast.emit('summonEvent', data);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnect...', socket.id);
    });

    socket.on('error', (err) => {
        console.log('received error from socket:', socket.id);
        console.log(err);
    });
});

const server_port = process.env.PORT || 52300;
server.listen(server_port, function (err: any) {
    if (err) throw err;
    console.log('Listening on port %d', server_port);
});
