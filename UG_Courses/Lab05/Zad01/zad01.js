/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const ocena = (kod) => {
    return (ruch) => {

        const punkty = {
            black: 0,
            white: 0
        };

        const found = [];

        let kodCopy = [...kod];

        let iterator = 0;
        let potentialWhite = [];

        const checkBlack = (a) => {
            if (kodCopy.indexOf(a, iterator) === ruch.indexOf(a, iterator)) {
                punkty.black += 1;
                found.push({type: "black", indexZ: kodCopy.indexOf(a, iterator), indexR: ruch.indexOf(a, iterator)});
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
            throw({typerr: "Podane ciagi sa innej dlugosci"});
        } else {
            kodCopy.forEach(checkBlack);
            iterator = 0;
            kodCopy.forEach(checkWhite);
        }

    };
};

let Z = [7, 5, 7, 5];
let R = [0, 7, 7, 3];

try {
    console.log(ocena(Z)(R));
} catch (e) {
    console.log(e.typerr);
}
