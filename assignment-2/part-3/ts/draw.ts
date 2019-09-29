import { Class } from "./Class";

const minimumX: number = 20;
const minimumY: number = 20;
const maxLineLength: number = 50;
const horizontalPadding: number = 10;
const verticalPadding: number = 10;

interface IPoint {
  x: number;
  y: number;
}

export class Draw {
  private static textSize: number = 14;
  private static maxLineLength: number = 400;
  private static nameHeight: number = 20;
  private static minClassHorizontalPadding: number = 20;
  private static textHorizontalPadding: number = 5;
  private static textVerticalPadding: number = 5;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private currentX: number = 0;
  private currentY: number = 0;

  private classes: Class[] | undefined;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = canvas.getContext("2d");

    this.currentX = horizontalPadding;
    this.currentY = verticalPadding;
  }

  /**
   * Creates a UML diagram from the classes
   *
   * @param classes the classes to be drawn
   */
  public draw(classes: Class[]): void {
    if (!classes) {
      return;
    }

    // first wrap text and calculating bounding boxes
    this.classes = classes;
    classes.forEach((c: Class) => {
      this.wrapText(c);
    });

    let x: number = 10;
    const startY: number = 10;

    classes.forEach((c: Class, index: number) => {
      // only draw top level classes
      if (c.parent === undefined) {
        this.drawClass(x, startY, c);

        if (index > 0) {
          x += classes[index - 1].width + Draw.minClassHorizontalPadding;

          // calculate the max width of the class before [children included]
          // this is the bounding box
        } else {
          // change this to bounding box method
          let parentWidth = c.width + Draw.minClassHorizontalPadding;
          let sumChildrenWidth = 0;

          if (c.children) {
            c.children.forEach((child: number) => {
              sumChildrenWidth +=
                this.classes[child].width + Draw.minClassHorizontalPadding;
            });
          }

          x =
            parentWidth > sumChildrenWidth
              ? x + parentWidth
              : x + sumChildrenWidth;

          // x += 200;
        }
      }
    });

    this.classes = undefined;
  }

  private drawClassName(x: number, y: number, c: Class): void {
    this.ctx.font = `bold ${Draw.textSize}px arial`;
    const size: TextMetrics = this.ctx.measureText(c.name);

    this.ctx.strokeStyle = "black";

    this.ctx.beginPath();

    this.ctx.rect(
      // this.currentX,
      // this.currentY,
      x,
      y,
      c.width + 5,
      Draw.textSize + 10
    );

    c.height = y + Draw.textSize + 10;

    this.ctx.stroke();

    this.ctx.fillText(c.name, x + c.width / 2 - size.width / 2 + 2.5, y + 15);
  }

  private drawClassProperties(x: number, y: number, c: Class): void {
    this.ctx.font = `${Draw.textSize}px arial`;
    const originalY = y;

    c.properties.forEach((p: string, index: number) => {
      this.ctx.fillText(
        p,
        x + Draw.textHorizontalPadding,
        // y + index * Draw.textSize + 5
        c.height + index * Draw.textSize + 10
        // y
      );
      y += Draw.textSize;
    });

    this.ctx.beginPath();
    this.ctx.rect(
      x,
      c.height,
      c.width + Draw.textHorizontalPadding,
      y - originalY
    );

    // c.height = y - originalY;
    c.height = y;

    this.ctx.stroke();
  }

  /**
   * Draw the class methods
   *
   * @param x x position
   * @param y y position
   * @param c class
   */
  private drawClassMethods(x: number, y: number, c: Class): void {
    this.ctx.font = `${Draw.textSize}px arial`;

    const originalY = y;

    y += 15;

    c.methods.forEach((m: string, i: number) => {
      // draw normally if no new line characters
      if (m.indexOf("\n") === -1) {
        // this.ctx.fillText(m, x + 5, y + 5);
        this.ctx.fillText(m, x + 5, y + i * 5);
      } else {
        // split on new line character
        const lines: string[] = m.split("\n");

        // draw each line
        lines.forEach((l: string, index) => {
          // dont indent
          if (index === 0) {
            this.ctx.fillText(`${l}`, x + 5, y + 5);
            // this.ctx.fillText(`${l}`, x + 5, y + 5);
          } else {
            this.ctx.fillText(`\t\t${l}`, x + 5, y + 5);
          }
          y += Draw.textSize;
        });
      }

      y += Draw.textSize;
    });

    this.ctx.beginPath();
    this.ctx.rect(
      x,
      c.height,
      c.width + Draw.textHorizontalPadding,
      y - originalY
    );

    this.ctx.stroke();
    c.height = y;
  }

  private wrapText(c: Class): void {
    this.ctx.font = `bold ${Draw.textSize}px arial`;
    const nameSize: TextMetrics = this.ctx.measureText(c.name);

    // to start with make the width of the box equal to the name
    c.width = nameSize.width;
    // height of name + padding
    c.height = Draw.textSize + 10;

    // change font to the normal font
    this.ctx.font = `${Draw.textSize}px arial`;

    if (c.properties) {
      c.height += 10;

      c.properties.forEach((p: string) => {
        const pSize: TextMetrics = this.ctx.measureText(p);

        if (pSize.width > Draw.maxLineLength) {
          console.log(`${p} is too long`);
        }

        if (pSize.width > c.width) {
          c.width = pSize.width + 20;
          c.height += Draw.textSize;
        }
      });
    }

    if (c.methods) {
      c.height += 10;

      // fillText doesnt support multi line
      // c.methods = c.methods.map((m: string) => {
      //   // get the size of the current string
      //   const mSize: number = this.ctx.measureText(m).width;

      //   let farIndex = m.length - 1;

      //   while (mSize > Draw.maxLineLength && farIndex !== -1) {
      //     console.log(`${m} is too long`);
      //     // atempt to add new line character after a comma
      //     const i = m.lastIndexOf(",", farIndex);
      //     farIndex = i;

      //     if (farIndex === -1) {
      //       break;
      //     }

      //     m = m.slice(0, farIndex) + "\n" + m.slice(farIndex + 1);

      //     // update max width
      //     const mSplit = m.split("\n");
      //     mSplit.forEach((str: string) => {
      //       console.log(str, farIndex, this.ctx.measureText(str).width);
      //       if (this.ctx.measureText(str).width > c.width) {
      //         c.width = this.ctx.measureText(str).width;
      //       }
      //     });

      //     console.log(m);
      //   }
      //   return m;
      // });

      // reset the width
      c.width = 0;

      // split strings if too long
      c.methods.forEach((str: string, index: number) => {
        // original length
        const originalLength = this.ctx.measureText(str).width;

        // right most index
        let farIndex = str.length - 1;

        // just testing by splitting on the ','
        c.methods[index] = str.split(",").join(",\n");

        const numberParams = str.split(",").length;

        // while (farIndex !== -1) {
        // }

        // for (let i = 0; i < numberParams; i++) {

        // }
      });

      // set to largest string width
      c.methods.forEach((str: string) => {
        str.split("\n").forEach((strs: string) => {
          if (this.ctx.measureText(strs).width > c.width) {
            c.width = this.ctx.measureText(strs).width;
          }
        });
      });
    }

    // padding
    c.width += 15;
    c.height += 10;
  }

  // maybe have a position, top left offeset - similar to matrix translation
  private drawClass(x: number, y: number, c: Class): void {
    c.x = x;
    c.y = y;

    // draw classname
    this.drawClassName(x, y, c);

    // draw properties
    if (c.properties) {
      this.drawClassProperties(x, c.height, c);
    }

    // draw methods
    if (c.methods) {
      this.drawClassMethods(x, c.height, c);
    }

    // draw arrow head if there are children
    if (c.children) {
      this.drawArrow({
        x: x + c.width / 2,
        y: c.height
      });
    }

    // if there is a parent draw a line to it
    if (c.parent !== undefined) {
      this.drawLine(
        {
          x: x + c.width / 2,
          y: y
        },
        {
          x: this.classes[c.parent].x + this.classes[c.parent].width / 2,
          // y: this.classes[c.parent].y + this.classes[c.parent].height
          y: this.classes[c.parent].height + 10
        }
      );
    }

    // draw the children
    if (c.children) {
      // iterate over each child
      c.children.forEach((ci: number, index: number) => {
        let childX;

        // first child always directly below parent
        if (index === 0) {
          childX = c.x + c.width / 2 - this.classes[ci].width / 2;
        } else {
          // use the previous drawn child for x location
          childX =
            this.classes[c.children[index - 1]].x +
            this.classes[c.children[index - 1]].width +
            Draw.minClassHorizontalPadding;
        }

        // calculating the y position
        let childY = c.y + c.height + 20;
        childY = c.height + 40;

        if (
          this.classes[ci].name === "Kiwifruit" ||
          this.classes[ci].name === "Cherry"
        ) {
          console.log(this.classes[ci].name, c);
        }

        // draw the child
        this.drawClass(childX, childY, this.classes[ci]);
      });
    }
  }

  private drawArrow(point: IPoint): void {
    const arrowHeight = 20;
    const arrowWidth = 20;

    this.ctx.beginPath();

    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(point.x + arrowWidth / 2, point.y + arrowHeight);
    this.ctx.lineTo(point.x - arrowWidth / 2, point.y + arrowHeight);
    this.ctx.lineTo(point.x, point.y);

    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawLine(start: IPoint, end: IPoint) {
    this.ctx.beginPath();

    this.ctx.moveTo(start.x, start.y);

    // up 5, accross, up
    this.ctx.lineTo(start.x, start.y - 5);
    this.ctx.lineTo(end.x, start.y - 5);
    this.ctx.lineTo(end.x, end.y + 10);

    this.ctx.stroke();
    this.ctx.closePath();
  }
}
