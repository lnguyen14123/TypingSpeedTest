const socket = io();
const typingDisplay = document.getElementById('words-display');

console.log("HI");

let wordsList;

socket.on('connection-info', (data)=>{
  wordsList = Array.from(data);

  wordsList.forEach(element => {

    let span = document.createElement('span');

    span.innerHTML = "<span> "+ element +"</span>";

    typingDisplay.appendChild(span);
  });


});

