// use strict transorfms javascript document into a modern style one
// preferably use it all the time
"use strict";

// "" and '' are the same thing in javascript
// `` give us additional functionality like embeding
// undefined = no value assigned, null = empty
// +num is a short for Number(num)
let num = "13";
let message = "Hello!";
let embededMessage = `${message} ...again`;
const ten = 10;
alert( message );

// power is now a normal equation, sqrts with fractions
// more on ** and operations precedence:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Operator_precedence
num = num**(1/2)

// outer is a label that allows us to break the outer loop from the inside
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) break outer; // (*)

    // do something with the value...
  }
}
alert('Done!');

// useful console uses:
// log - println, trace - shows the script execution pathing,
// time/timeEnd - shows time of execution
console.log(num);

// same as
// let double = function(n) { return n * 2 }
let double = n => n * 2;
alert( double(3) ); // 6

let sayHi = () => alert("Hello!");
sayHi();

let sum = (a, b) => {  // the figure bracket opens a multiline function
  let result = a + b;
  return result; // if we use figure brackets, use return to get results
};
