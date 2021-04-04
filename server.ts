import { Socket } from "socket.io";

const server = require('http').createServer();
const io = require('socket.io')(server, { pingTimeout: 60000, pingInterval: 4000 });

io.on('connection', (socket: Socket) => {
    console.log('socket connect...', socket.id);

    socket.on('card:play', (data) => {
        console.log(data);
        socket.broadcast.emit('card:play', data);
    });

    socket.on('card:remove', (data) => {
        console.log(data);
        socket.broadcast.emit('card:remove', data);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnect...', socket.id);
    });

    socket.on('error', (err) => {
        console.log('received error from socket:', socket.id);
        console.log(err);
    });
});

const server_port = process.env.PORT || 8080;
server.listen(server_port, function (err: any) {
    if (err) throw err;
    console.log('Listening on port %d', server_port);
});
