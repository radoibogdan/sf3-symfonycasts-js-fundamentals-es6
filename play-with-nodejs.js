// execute this file using cmd
// node play-with-nodejs.js

// Will cause error if you use let (which is great)
// console.log(aNumberLet);

// Will not cause an error due to variable hoisting
console.log(aNumber);

let aNumberLet = 100;
var aNumber = 10;

if (true) {
    (() => {
        // Will log 10 in setTimeout because aNumber has scope only inside the arrow function
        var aNumber = 42;
    })();
}

if (true) {
    // Overides the initial aNumber
    // var aNumber = 50
    // Does not overide the initial aNumber, let is block scope
    // let aNumber = 50;
}

setTimeout(() => {
    console.log(aNumber);
}, 2000);

console.log('Waiting for the timeout function to execute (2sec).')


// ######################  CONST ######################
const name = 'Bogdan';
// This next line will cause an error becaise we can't reassign a const variable
// name = 'Alex';

// But we can edit an object
const person = {hasName : true}
person.hasName = false
console.log(person);

