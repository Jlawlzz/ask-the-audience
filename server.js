'use strict';

const http = require('http');
const express = require('express');

const app = express();
let port = process.env.PORT || 3000;
let votes = {};

let server = http.createServer(app)
                 .listen(port, function() {
                   console.log('Listening on port' + port + '.');
                 });

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected');

  socket.on('disconnect', function () {
    console.log('A user has disconected', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(votes);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });

  socket.on('message', function(channel, message){
    if(channel === 'voteCast') {
      socket.emit('lastVote', message);
      votes[socket.id] = message;
      io.sockets.emit('voteCount', countVotes(votes));
    };
  });
});

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

function countVotes(votes) {
  let voteCount = {
    A:0,
    B:0,
    C:0,
    D:0
  };
  for(var vote in votes){
    voteCount[votes[vote]]++
  }
  return voteCount;
}

module.exports = server;
