const socket = io();
const typingDisplay = document.getElementById('words-display');
const typingInput = document.getElementById('typing-input');


let wordsList;
let wordsTyped = [];
let furthestWordOn = 0;
let wordOn = 0;

socket.on('connection-info', (data)=>{
  wordsList = Array.from(data);
  wordsList.forEach(element => {
    let span = document.createElement('span');
    span.innerHTML = element.word;

    typingDisplay.appendChild(span);
    typingDisplay.childNodes[wordOn].style.background = "#24ab33";
  });
});

typingInput.addEventListener('keydown', (e)=>{
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

