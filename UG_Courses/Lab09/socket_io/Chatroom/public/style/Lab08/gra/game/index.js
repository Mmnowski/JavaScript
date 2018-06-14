//jshint node: true, esversion: 6
let game;
let gameData = [];

const initializeGame = (size, dim) => {
  for(let i=0; i<size; i++){
    gameData.push(Math.floor(Math.random() * dim));
  }
}

const newGame = (req, res) => {
  const gameConfig = {};

  if(req.body.size){
    gameConfig.size = req.body.size;
  } else {
    gameConfig.size = 5;
  }
  if(req.body.dim){
    gameConfig.dim = req.body.dim;
  } else {
    gameConfig.dim = 9;
  }
  if(req.body.max){
    gameConfig.max = req.body.max;
  } else {
    gameConfig.max = 0;
  }

  initializeGame(gameConfig.size, gameConfig.dim);
  let gameID = Math.random().toString(36).substr(2, 9);

  game = {
    id: gameID,
    data: gameData,
    config: gameConfig
  }

  gameData = [];
  games.push(game);

  res.session.game = game;
  console.log(game);
  res.send(`Utworzono grę. Rozmiar - ${gameConfig.size}. Ilość kolorów - ${gameConfig.dim}`);

};

const markAnswer = (req, res) => {
    let mark = req.body.guess;
    if(mark.length < game.gameConfig.size){
      res.send("niewłaściwy rozmiar");
    }

    var guess = req.session.move;
    var pattern = req.bod.mark;
    
    const punkty = {
      black: 0,
      white: 0
    };

  const ocena = (kod) => {
    return (ruch) => {


      const found = [];

      let kodCopy = [...kod];

      let iterator = 0;
      let potentialWhite = [];

      const checkBlack = (a) => {
        if (kodCopy.indexOf(a, iterator) === ruch.indexOf(a, iterator)) {
          punkty.black += 1;
          found.push({ type: "black", indexZ: kodCopy.indexOf(a, iterator), indexR: ruch.indexOf(a, iterator) });
          delete kodCopy[iterator];
          delete ruch[iterator];
        }
        iterator++;
      };

      const checkWhite = (a) => {
        if (ruch.includes(a)) {
          // if (found.indexZ.includes(kodCopy.indexOf(a))) {
          //     potentialWhite.splice(potentialWhite.indexOf(a), 1);
          //     punkty.white += 1;
          // }
          console.log(ruch.indexOf(a));
          ruch.splice(ruch.indexOf(a), 1);
          punkty.white += 1;
        }
      };

      if (kodCopy.length !== ruch.length) {
        throw ({ typerr: "Podane ciagi sa innej dlugosci" });
      } else {
        kodCopy.forEach(checkBlack);
        iterator = 0;
        kodCopy.forEach(checkWhite);
      }

    };
  };
};

module.exports = {
    newGame,
    markAnswer
};
