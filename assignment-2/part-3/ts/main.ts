import { Class } from "./Class";
import { Draw } from "./draw";

let UMLInputString: string;

// maybe change to const
const classes: Class[] = [];
let draw: Draw;

function setup(): void {
  (document.getElementById("draw") as HTMLInputElement).onclick = (
    e: MouseEvent
  ) => {
    UMLInputString = (document.getElementById("UML-input") as HTMLInputElement)
      .value;

    // wipe without destroying reference
    classes.length = 0;

    UMLInputString = (document.getElementById("UML-input") as HTMLInputElement)
      .value;
    console.log(UMLInputString);

    read();
    draw = new Draw(
      document.getElementById("canvas") as HTMLCanvasElement,
      1000,
      400
    );
    draw.draw(classes);
  };
}

function inClasses(name: string): number {
  for (let i: number = 0; i < classes.length; i++) {
    if (classes[i].name === name) {
      return i;
    }
  }

  return -1;
}

function read(): void {
  console.log("reading");

  const lines: string[] = UMLInputString.split("\n");

  let currentClass: string;

  for (let i = 0; i < lines.length; i++) {
    const tokens: string[] = lines[i].split(" ");

    if (tokens[0] === "class") {
      // let cLocation = inClasses(tokens[0]);

      // if (cLocation !== -1) {

      // }

      const c: Class =
        tokens.length === 4
          ? new Class(tokens[1], tokens[3])
          : new Class(tokens[1]);

      let parent: Class = null;

      for (let j = i + 1; j < lines.length; j++) {
        // if (lines[j].startsWith("class") || lines[j].startsWith(" ")) {
        if (lines[j].startsWith("class")) {
          break;
        }

        // check if already exists (children created it)
        // only need to update the details
        const alreadyExists = inClasses(tokens[1]) !== -1;

        if (alreadyExists) {
          console.log("already created");
          continue;
        }

        // create parent if not exists
        if (tokens.length === 4) {
          if (inClasses(tokens[3]) === -1) {
            classes.push(new Class(tokens[3]));
            parent = classes[classes.length - 1];
            parent.children = [];
          }
        }

        // console.log(lines[j]);

        // console.log(lines[j]);

        // methods
        if (lines[j].includes("(")) {
          if (!c.methods) {
            c.methods = [];
          }

          c.methods.push(lines[j]);
          // properties
        } else if (lines[j].includes(":")) {
          if (!c.properties) {
            c.properties = [];
          }
          // c.properties.push(lines[i + 1]);
          c.properties.push(lines[j]);
        }
      }

      // console.log(c);
      // return;

      // is a child
      if (parent) {
        c.parent = parent;
        parent.children.push(c);
        // is a parent
      } else {
        classes.push(c);
      }
    }
  }

  console.log(classes);

  //trimming
  console.log("removing");

  // probably wont work as intended...
  const stripped: Class[] = classes.filter((value, index, self) => {
    for (let i = 0; i < self.length; i++) {
      if (i === index) {
        continue;
      }

      if (self[i].name === value.name) {
        return false;
      }
    }

    return true;
  });

  console.log(stripped);
}

setup();

const x: Class = new Class("Banana", "Apple");
