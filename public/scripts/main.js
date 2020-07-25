const socket = io();
const typingDisplay = document.getElementById('words-display');
const resultDisplay = document.getElementById('results-display')
const typingInput = document.getElementById('typing-input');
const wordsTypedDis = document.getElementById('words-typed');
const timerDis = document.getElementById('timer');
const wpmDis = document.getElementById('wpm');
const resetBtn = document.getElementById('reset-btn');

let wordsList;
let wordsTyped = [];
let furthestWordOn = 0;
let wordOn = 0;
let charactersCorrect = 0;
let wordsCorrect = 0;
let siteState = 'typing';

let audioOn = 0;
let keyAudios = [];
initKeyAudios();

const TYPING_TIME_GIVEN = 60;
let count = TYPING_TIME_GIVEN;

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
  timerDis.innerHTML = "Time Left: " + TYPING_TIME_GIVEN;
  wpmDis.innerHTML = 'WPM: ' + 0;
  resultDisplay.style.display = 'none';
});



//when user presses space/backspace

typingInput.addEventListener('keydown', (e)=>{

  if(audioOn==keyAudios.length){audioOn=0};

  keyAudios[audioOn].play();
  audioOn++;


  //START TIMER WHEN FIRST KEY PRESSED
  if(timer==undefined){
    count = TYPING_TIME_GIVEN;
    timer = setInterval(function() {
      count--;

      if(count == 0) {
        clearInterval(timer);
        timerDis.innerHTML = "Time Left: " + 0;

        //all of the words that the user typed, average WPM of all users, and average CPM of all users=
        if(siteState!='results'){
          typingDisplay.style.display = 'none';
          resultDisplay.style.display = 'block';
          let finalWPM = Math.round((charactersCorrect/5) / (TYPING_TIME_GIVEN/60));
          let finalCPM = Math.round((charactersCorrect) / (TYPING_TIME_GIVEN/60));
  
          let wpmDv = document.createElement('div');
          let cpmDv = document.createElement('div');
          let totalDv = document.createElement('div');
          let correctDv = document.createElement('div');
          let incorrectDv = document.createElement('div');

          wpmDv.innerHTML = "Your WPM was: " + finalWPM;
          cpmDv.innerHTML = "Your CPM was: " + finalCPM + " (Thats "+Math.round(finalCPM/60)+" key presses a second!)";
          totalDv.innerHTML = "Total words typed: " + furthestWordOn;
          correctDv.innerHTML = "Correct words typed: " + wordsCorrect;
          incorrectDv.innerHTML = "Incorrect words typed: " + (furthestWordOn-wordsCorrect);

          document.getElementById('info-main').appendChild(wpmDv);
          document.getElementById('info-main').appendChild(cpmDv);
          document.getElementById('info-main').appendChild(totalDv);
          document.getElementById('info-main').appendChild(correctDv);
          document.getElementById('info-main').appendChild(incorrectDv);

          typingInput.style.display = "none";
          siteState = 'results';  
        }
      }

      wpmDis.innerHTML = 'WPM: ' + Math.round((charactersCorrect/5)/ ((TYPING_TIME_GIVEN-count)/60));
      timerDis.innerHTML = "Time Left: " + count;
    }, 1000);  
  }

  //RUN ONLY WHEN IN TYPING STATE
  if(siteState == 'typing'){
    if(e.code == "Space" || e.code == "Enter"){
      e.preventDefault();
      if(e.target.value.trim().toLowerCase()===wordsList[wordOn].word){
        if(wordsList[wordOn].state != 'correct'){
          charactersCorrect+=wordsList[wordOn].word.length;
          wordsCorrect++;
        }
        typingDisplay.childNodes[wordOn].style.color = '#2bed53';
        wordsList[wordOn].state = 'correct';
      }else{
        if(wordsList[wordOn].state == 'correct'){
          charactersCorrect-=wordsList[wordOn].word.length;
          wordsCorrect--;
        }
        typingDisplay.childNodes[wordOn].style.color = '#ff3636';
        wordsList[wordOn].state = 'incorrect';
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
      typingDisplay.childNodes[wordOn-1].style.background = "#1a1b1c";
      typingDisplay.childNodes[wordOn].style.background = "#24ab33";

      typingDisplay.childNodes[wordOn].scrollIntoView({ behavior: 'smooth', block: 'center'});

    }else if(e.code == "Backspace" && wordOn>0){
      if(e.target.value===""){
        e.preventDefault();
        wordsTyped[wordOn] = e.target.value;
  
        wordOn--;
        typingDisplay.childNodes[wordOn+1].style.background = "#1a1b1c";
        typingDisplay.childNodes[wordOn].style.background = "#36ff4d";  
  
        e.target.value = wordsTyped[wordOn];
      }
    }  
  }
});

//reset button pressed
resetBtn.addEventListener('click', ()=>{
  timerDis.innerHTML = "Time Left: " + TYPING_TIME_GIVEN;
  clearInterval(timer);
  timer = undefined;
  count = TYPING_TIME_GIVEN;
  wordOn = 0;
  siteState = 'typing';
  charactersCorrect = 0;
  wordsTyped = [];
  furthestWordOn = 0;
  typingDisplay.childNodes.forEach(element=>{
    element.style.background = "#1a1b1c";
    element.style.color = '#e6cc67';
  });

  typingInput.style.display = "block";
  typingDisplay.style.display = 'block';
  resultDisplay.style.display = 'none';

  removeAllChildNodes(document.getElementById('info-main'));
  removeAllChildNodes(typingDisplay);
  
  wordsTypedDis.innerHTML = "Words Typed: " + furthestWordOn;

  typingInput.value = "";
  socket.emit('words-request');
});


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function initKeyAudios(){
  for(var i = 0; i<10; i++){
    keyAudios.push(new Audio('../fx/keySoundT.mp3'));
  }
}