//jshint browser: true, esversion: 6
const notes = document.querySelectorAll('[class^="score"]');
let selectedplayer = 10;

let httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'http://localhost:4000/list', true);
httpRequest.responseType = 'json';
httpRequest.onload = () => {
  list = httpRequest.response;
  loaded = true;

  let listContener = document.getElementById('list');
  list.forEach(e => {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(e.name));
    listContener.appendChild(li);
  });
};
httpRequest.send();

window.onload = function () {
  var button = document.getElementById('sendbtn');
  button.addEventListener('click', () => {
    let notelist = [];
    let sum;
    notes.forEach((note) => {
      if (typeof note === "number") {
        sum += note.textContent;
        list.push(note);
      } else {
        list.push(0);
      }
    });
    console.log('click');

    httpRequest.open('POST', `http://localhost:4000/result/${selectedplayer}`, true);
    httpRequest.responseType = 'json';
    httpRequest.send({ number: selectedplayer, score: sum, notes: notelist });
  });
}