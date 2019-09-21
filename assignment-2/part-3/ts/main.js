"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Class_1 = require("./Class");
let UMLInputString = `
class Banana extends Apple
-bend: double 
+peel(): void

class Date extends Eggfruit

class Apple
-seeds: int

class Cherry extends Apple

class Eggfruit

class Fig

class Grape extends Fig

class Honeydew extends Fig
+wash(solvent: Solvent, howManyTimes: int, solventTemperature: double, scrubIntensity: double): void
+dry(): void

class Imbe extends Fig

class Jackfruit extends Honeydew
+slice(slices: int): void

class Kiwifruit extends Cherry
`;
// maybe change to const
let classes = [];
function setup() {
    document.getElementById("draw").onclick = (e) => {
        UMLInputString = document.getElementById("UML-input").value;
        console.log(UMLInputString);
    };
    read();
}
function inClasses(name) {
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].name === name) {
            return i;
        }
    }
    return -1;
}
function read() {
    console.log('reading');
    const lines = UMLInputString.split('\n');
    let currentClass;
    for (let i = 0; i < lines.length; i++) {
        const tokens = lines[i].split(' ');
        if (tokens[0] === "class") {
            // let cLocation = inClasses(tokens[0]);
            // if (cLocation !== -1) {
            // }
            let c = tokens.length === 4 ? new Class_1.Class(tokens[1], tokens[3]) : new Class_1.Class(tokens[1]);
            if (!lines[i + 1].startsWith('class')) {
                i++;
                console.log(lines[i]);
            }
            // console.log(tokens[1]);
        }
    }
    console.log(classes);
}
setup();
const x = new Class_1.Class("Banana", "Apple");
