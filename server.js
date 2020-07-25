const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const wordData = require('./utils/words.js');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;
const MAX_TYPING_LIST_SIZE = 250;


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket=>{
  //send list of words over to front end
  // socket.emit('wordsList', )

  let typingList = [];

  for(var i = 0; i<MAX_TYPING_LIST_SIZE; i++){
    let arrObject = {"word": wordData[Math.floor(Math.random()*wordData.length)] , "state":'notTyped'};
    typingList.push(arrObject);
  }

  socket.emit('connection-info',typingList);
});

//250 words sent to front end in an array (world record = 216 wpm)



server.listen(PORT, ()=>console.log('Typing site running at port: ' + PORT));