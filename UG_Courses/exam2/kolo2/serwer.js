/*jshint node: true, esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const serveStatic = require('serve-static');


const app = express();
const httpServer = require('http').createServer(app);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

const list = [
    { no: 1, name: 'Wiga' },
    { no: 2, name: 'Paterna' },
    { no: 3, name: 'Etira' },
    { no: 4, name: 'Emandorissa' },
    { no: 5, name: 'Patria' },
    { no: 6, name: 'Galacja' },
    { no: 7, name: 'Paeksa' },
    { no: 8, name: 'Pilastra' },
    { no: 9, name: 'Elfira' },
    { no: 10, name: 'Fanabella' },
    { no: 11, name: 'Pustynna Noc' },
    { no: 12, name: 'Gratena' },
    { no: 13, name: 'Matahna' },
    { no: 14, name: 'Panetta' },
    { no: 15, name: 'Baklava' },
    { no: 16, name: 'Piera' },
    { no: 17, name: 'Wersa' },
    { no: 18, name: 'Atanda' },
    { no: 19, name: 'Escalada' },
    { no: 20, name: 'Faworyta' },
    { no: 21, name: 'Angelina' },
    { no: 22, name: 'Kalahari' },
    { no: 23, name: 'Godaiva' },
    { no: 24, name: 'Alamina' },
    { no: 25, name: 'Piacolla' },
    { no: 26, name: 'Wieża Bajek' }
];

const scoreboard = [
    { no: 1, notes: [1,2,3,4,5], score: 15}
];

io.on('connection', function (socket) {
    socket.emit('players', list);
});

app.get('/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(list));
});

app.post('/result/:no', (req, res) => {
    // zapisuje wynik zawodnika o numerze „no”
    let number = req.body.number;
    let newscore = req.body.score;
    let newnotes = req.body.notes
    scoreboard.push({no: number, notes: newnotes, score: newscore})
    console.log(scoreboard);
});

app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/public/results.html');
});

app.listen(4000, () => {
    console.log('Serwer działa na porcie 4000');
});