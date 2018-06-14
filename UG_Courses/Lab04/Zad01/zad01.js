/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const defFun = (fun, types) => {
    fun.typeConstr = types;
    return fun;
};

const appFun = (f, ...args) => {

    function checkTypes(value,index,array){
        if (typeof value !== f.typeConstr[index]){
            throw({typerr: `Blad: Argument ${value} nie jest typu ${typeof value}. Typ argumentu: ${f.typeConstr[index]}.`});
        }
    }

    args.forEach(checkTypes);
    return f.apply(this, [...args]);
};

const myfun = defFun((a, b) => a + b, ['number', 'number']);

try {
    console.log(appFun(myfun, 12, 15));
} catch (e) {
    console.log(e.typerr);
}
