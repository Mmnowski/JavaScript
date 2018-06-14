/* jshint strict: global, esversion: 6, devel: true */
'use strict';

class tekst {

    static nbsp() {
        let napis = "Ala i As\n poszli w las";
        napis = napis.replace(/(\s[aiouwz][\s\t\n])/g, (match, word) => word.substring(0, 2) + '&nbsp;');
        console.log(napis);
    }

}

tekst.nbsp();
