const socket = io();
const typingDisplay = document.getElementById('words-display');
const typingInput = document.getElementById('typing-input');
const wordsTypedDis = document.getElementById('words-typed');
const timerDis = document.getElementById('timer');
const wpmDis = document.getElementById('wpm');
const resetBtn = document.getElementById('reset-btn');


let wordsList;
let wordsTyped = [];
let furthestWordOn = 0;
let wordOn = 0;

let count = 60;

let timer;


//when user connects
socket.on('connection-info', (data)=>{
  wordsList = Array.from(data);
  wordsList.forEach(element => {
    let span = document.createElement('span');
    span.innerHTML = element.word;

    typingDisplay.appendChild(span);
    typingDisplay.childNodes[wordOn].style.background = "#24ab33";
  });

  wordsTypedDis.innerHTML = "Words Typed: " + furthestWordOn;
  timerDis.innerHTML = "Time Left: " + 60;
  wpmDis.innerHTML = 'WPM: ' + 0;

});



//when user presses space/backspace

typingInput.addEventListener('keydown', (e)=>{
  if(timer==undefined){
    count = 60;
    timer = setInterval(function() {
      count--;
      if(count == 0) clearInterval(timer);
      timerDis.innerHTML = "Time Left: " + count;
    }, 1000);  
  }

  if(e.code == "Space" || e.code == "Enter"){
    e.preventDefault();
    if(e.target.value.trim().toLowerCase()===wordsList[wordOn].word){
      typingDisplay.childNodes[wordOn].style.color = '#24ab33';
    }else{
      typingDisplay.childNodes[wordOn].style.color = '#ff3636';
    }

    if(wordOn<=furthestWordOn){
      wordsTyped[wordOn] = e.target.value;
    }else{
      wordsTyped.push(e.target.value);
    }
 
    wordOn++;
    furthestWordOn = wordOn>furthestWordOn ? wordOn:furthestWordOn;
    wordsTypedDis.innerHTML = "Words Typed: " + furthestWordOn;
    e.target.value = "";
    typingDisplay.childNodes[wordOn-1].style.background = "#1d1c1f";
    typingDisplay.childNodes[wordOn].style.background = "#24ab33";
  }else if(e.code == "Backspace" && wordOn>0){
    if(e.target.value===""){
      e.preventDefault();
      wordsTyped[wordOn] = e.target.value;

      wordOn--;
      typingDisplay.childNodes[wordOn+1].style.background = "#1d1c1f";
      typingDisplay.childNodes[wordOn].style.background = "#36ff4d";  

      e.target.value = wordsTyped[wordOn];
    }
  }
});

//reset button pressed
resetBtn.addEventListener('click', ()=>{
  timerDis.innerHTML = "Time Left: " + 60;
  clearInterval(timer);
  timer = undefined;
  count = 60;
  wordOn = 0;
  wordsTyped = [];
  furthestWordOn = 0;
  typingDisplay.childNodes.forEach(element=>{
    element.style.background = "#1d1c1f";
    element.style.color = '#e6cc67';
  });


  wordsTypedDis.innerHTML = "Words Typed: " + furthestWordOn;
  typingDisplay.childNodes[wordOn].style.background = "#24ab33";

  typingInput.value = "";
});


