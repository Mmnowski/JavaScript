//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

const heartBeat = 5000;
const mainChatroom = 'main'
let currentChatroom;
let room;
let users = [];
let rooms = [];

rooms.push({ name: mainChatroom, messages: [] })

const chat = io
    .of(`/${mainChatroom}`)
    .on('connect', (socket) => {
        currentChatroom = mainChatroom;
        room = rooms.find((obj) => {
            return obj.name === currentChatroom;
        })
        let lastmessages = room.messages.slice();
        socket.heartbeat = setTimeout(() => {
            const { username } = socket;
            let index = users.indexOf(username);
            if (index != -1) {
                users.splice(index, 1);
                socket.emit('userlist', '');
                socket.broadcast.emit('userlist', '');
                users.forEach(element => {
                    socket.emit('userlist', element);
                    socket.broadcast.emit('userlist', element);
                });
            }
            socket.disconnect();

        }, heartBeat * 2);
        socket.on('heartbeat', () => {
            clearTimeout(socket.heartbeat);
            const { username } = socket;
            console.log(`ping from ${username}`);
            socket.heartbeat = setTimeout(() => {
                let index = users.indexOf(username);
                if (index != -1) {
                    users.splice(index, 1);
                    socket.emit('userlist', '');
                    socket.broadcast.emit('userlist', '');
                    users.forEach(element => {
                        socket.emit('userlist', element);
                        socket.broadcast.emit('userlist', element);
                    });
                }
                socket.disconnect();
            }, heartBeat * 2);
        });
        socket.on('user', (data) => {
            console.log('Socket.io: połączono.')
            socket.username = data;
            users.push(data);
            socket.emit('userlist', '');
            socket.broadcast.emit('userlist', '');
            users.forEach(element => {
                socket.emit('userlist', element);
                socket.broadcast.emit('userlist', element);
            });
            lastmessages.splice(-10).forEach(element => {
                socket.emit('message', element);
            });

            lastmessages = rooms.messages.slice();
        });
        socket.on('message', (data) => {
            room = rooms.find((obj) => {
                return obj.name === currentChatroom;
            })
            room.messages.push(data);
            socket.emit('message', data);
            socket.broadcast.emit('message', data);
        });
        socket.on('disconnect', () => {
            console.log('Socket.io: rozłączono.');
        });
        socket.on('tryuser', (data) => {
            if (users.includes(data)) {
                socket.emit('usernameDenied');
            } else {
                socket.emit('usernameAccepted');
            }
        });
        socket.on('tryroom', (data) => {
            if (rooms.filter((obj) => {
                obj.name === data
            })) {
                socket.emit('roomExists');
            } else {
                socket.join('data');
                currentChatroom = data;
                rooms.push({ name: data, messages: [] });
                socket.emit('roomCreated', currentChatroom)
            }
        });
        socket.on('joinroom', (data) => {
            socket.join('data');            
            currentChatroom = data;
            room = rooms.find((obj) => {
                return obj.name === currentChatroom;
            })
            lastmessages = room.messages.slice();
            lastmessages.splice(-10).forEach(element => {
                socket.emit('message', element);
            });

            lastmessages = room.messages.slice();
        });
        socket.on('removeuser', (data) => {
            clearTimeout(socket.heartbeat);
            let index = users.indexOf(data);
            if (index != -1) {
                users.splice(index, 1);
                socket.emit('userlist', '');
                socket.broadcast.emit('userlist', '');
                users.forEach(element => {
                    socket.emit('userlist', element);
                    socket.broadcast.emit('userlist', element);
                });
            }
        });
        socket.on('error', (err) => {
            console.dir(err);
        });
    });

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
