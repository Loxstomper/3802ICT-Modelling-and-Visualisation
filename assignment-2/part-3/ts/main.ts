import { Class } from "./Class";
import { Draw } from "./draw";

let UMLInputString: string;

// maybe change to const
const classes: Class[] = [];
let draw: Draw;

function getInputAndDraw(): void {
  UMLInputString = (document.getElementById("UML-input") as HTMLInputElement)
    .value;

  // wipe without destroying reference
  classes.length = 0;

  UMLInputString = (document.getElementById("UML-input") as HTMLInputElement)
    .value;

  read();
  draw = new Draw(
    document.getElementById("canvas") as HTMLCanvasElement,
    1200,
    400
  );

  draw.draw(classes);
}

function setup(): void {
  (document.getElementById("draw") as HTMLInputElement).onclick = (
    e: MouseEvent
  ) => {
    getInputAndDraw();
  };
}

function inClasses(name: string | undefined): number {
  if (name === undefined) {
    return -1;
  }

  for (let i: number = 0; i < classes.length; i++) {
    if (classes[i].name === name) {
      return i;
    }
  }

  return -1;
}

function read(): void {
  const lines: string[] = UMLInputString.split("\n");

  // iterate over all lines in input
  for (let i = 0; i < lines.length; i++) {
    // tokenize each line
    const tokens: string[] = lines[i].split(" ");

    // if line begins with "class"
    if (tokens[0] === "class") {
      // get index of parent
      let parentIndex: number = inClasses(tokens[3]);

      if (parentIndex !== -1) {
        // initialise
        if (!classes[parentIndex].children) {
          classes[parentIndex].children = [];
        }
        // to be created class
        classes[parentIndex].children.push(classes.length);
      }

      // is a child but parent doesnt exist
      if (tokens[3] && parentIndex === -1) {
        // create the parent
        classes.push(new Class(tokens[3]));
        // keep track of the index
        parentIndex = classes.length - 1;
        // add this current class as a child of the parent
        classes[parentIndex].children = [];
        classes[parentIndex].children.push(classes.length);
      }

      // check if class already exists
      const alreadyExists = inClasses(tokens[1]) !== -1;
      const index: number | null = alreadyExists ? inClasses(tokens[1]) : null;
      const c: Class = new Class(tokens[1]);

      // get the properties and methods
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith("class")) {
          break;
        }

        // methods
        if (lines[j].includes("(")) {
          // initialise arrays
          if (alreadyExists && !classes[index].methods) {
            classes[index].methods = [];
          } else {
            if (!c.methods) {
              c.methods = [];
            }
          }

          // add to existing otherwise add to the current class
          if (alreadyExists) {
            classes[index].methods.push(lines[j]);
          } else {
            c.methods.push(lines[j]);
          }

          // properties
        } else if (lines[j].includes(":")) {
          // initialise arrays
          if (alreadyExists && !classes[index].properties) {
            classes[index].properties = [];
          } else {
            if (!c.properties) {
              c.properties = [];
            }
          }

          // add to existing oetherwise add to the current class
          if (alreadyExists) {
            classes[index].properties.push(lines[j]);
          } else {
            c.properties.push(lines[j]);
          }
        }
      }

      // add to array if not already existing
      if (!alreadyExists) {
        if (parentIndex !== -1) {
          c.parent = parentIndex;
        }
        classes.push(c);
      }
    }
  }

  console.log(classes);
}

setup();
getInputAndDraw();
