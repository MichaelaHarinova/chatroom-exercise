const express = require('express');
const http = require('http');


const app = express();
const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));
const server = http.createServer(app);

server.listen(8080, () => {
    console.log("server running on " + 8080);
});

//server setup and connection to the client
const io = require('socket.io')(server);

let counter = 0;
let allUsers = [];
io.on('connection', (socket) => {
    console.log(counter + ' someone connected');
    counter++

    socket.on('sendAll', (data) => {
        io.emit("displayMessage", (data));
    });
    socket.on('sendMe', (data) => {
        socket.emit("displayMessage", (data));
    });

//joining chat
    socket.on('join', function (user) {
        allUsers.push(user);    //{id: socket.id, name: username}
        io.emit('join', (allUsers));
    });

//leaving chat
    socket.on('disconnect', () => {
        let ID = socket.id;
        allUsers.forEach( (user, index) => {
           if(user.id === ID)
            allUsers.splice(index, 1);
        })
        io.emit('join',(allUsers));
    });
});

