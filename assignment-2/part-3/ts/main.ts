import {Class} from "./Class";

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
let classes: Class[] = [];

function setup() : void {
    (<HTMLInputElement>document.getElementById("draw")).onclick = (e: MouseEvent) => {
        UMLInputString = (<HTMLInputElement> document.getElementById("UML-input")).value;
        console.log(UMLInputString);
    }

    read();
}

function inClasses(name: string) : number {
    for (let i : number = 0; i < classes.length; i ++) {
        if (classes[i].name === name) {
            return i;
        }
    }

    return -1;
}

function read(): void {
    console.log('reading');

    const lines: string [] = UMLInputString.split('\n');

    let currentClass: string;

    for (let i = 0; i < lines.length; i ++) {
        const tokens: string[] = lines[i].split(' ');

        if (tokens[0] === "class") {

            // let cLocation = inClasses(tokens[0]);

            // if (cLocation !== -1) {

            // }


            let c: Class = tokens.length === 4 ? new Class(tokens[1], tokens[3]) : new Class(tokens[1]);

            for (let j = i + 1 ; j < lines.length; j ++) {

                if (lines[j].startsWith('class') || lines[j].startsWith(' ')) {
                // if (lines[j].startsWith('class')) {
                    break;
                }

                // console.log(lines[j]);

                // console.log(lines[j]);

                if (lines[j].includes('(')) {
                    if (!c.methods) {
                        c.methods = [];
                    }

                    c.methods.push(lines[j]);
                } else {
                    if (!c.properties) {
                        c.properties = [];
                    }
                    // c.properties.push(lines[i + 1]);
                    c.properties.push(lines[j]);
                }
            }

            // console.log(c);
            // return;

            // console.log(c);
            classes.push(c);

            // console.log(c);

            // console.log(tokens[1]);
        }




    }

    console.log(classes);
}

setup();






const x: Class = new Class("Banana", "Apple");

