/* jshint strict: global, esversion: 6, devel: true */
'use strict';

class szablon {

    static podstaw(info) {

        let szab =
            '<table border="{border}">' +
            '  <tr><td>{first}</td><td>{last}</td></tr>' +
            '</table>';

        Object.keys(info).forEach(exp => {
            szab = szab.replace(new RegExp(`{${exp}}`, `g`), `${info[exp]}`);
        });

        console.log(szab);
    }

}

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

szablon.podstaw(dane);