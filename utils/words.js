const fs = require('fs');
const path = require('path');

var wordData = [];

fs.readFile(path.join(__dirname,"../public",'trimmedWords.txt'), (err, data)=>{
  let raw = Array.from(data.toString().split('\n'));
  raw.forEach((word)=>{
    wordData.push(word.substring(0, word.length-1));
  });
});

module.exports = wordData;

