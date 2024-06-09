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

// ######################  CLASS SYNTAX ######################
// ######################  INHERITANCE ######################
class Person {
    constructor(age) {
        this.age = age;
    }

    returnCharacteristics() {
        return this.age;
    }
}

class Developer extends Person {
    constructor(age, ability) {
        super(age);
        this.ability = ability;
    }
    // Overide inherited class
    returnCharacteristics() {
        let age = super.returnCharacteristics();
        return [age, this.ability];
    }
}

const bogdan = new Person(35);
console.log(bogdan.returnCharacteristics());

const employee = new Developer(22, 'flies in the sky');
console.log(employee.returnCharacteristics());


// ######################  Spread operator ######################

let printThreeThings = function(thing1, thing2, thing3) {
    console.log(thing1, thing2, thing3);
}
let yummyThings = ['pizza', 'gelato', 'sushi'];

printThreeThings(...yummyThings);

// Merging using spread operator
let greatThings = ['swimming', 'sunsets', ...yummyThings, 'Paris']
console.log("Merging using spread operator", greatThings);

// Copy by reference, the initial array is mutated (summer is added to the initial array)
let copyByReference = greatThings;
copyByReference.push('summer');
console.log(greatThings, copyByReference);

// Copy using spread operator, the initial array is NOT mutated
let copyUsingSpread = [...greatThings];
copyUsingSpread.push('carnavals');
console.log(greatThings, copyUsingSpread);

// ###################### Template strings ######################
const food = 'burgers';
const oldPhrase = 'The year is ' +  new Date().getFullYear() + ' and I love ' + food +'.';
const newPhrase = `The year is ${new Date().getFullYear()} and I love ${food}.`
console.log(newPhrase);

// Line breaks



