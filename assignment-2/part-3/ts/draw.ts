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
  private static maxLineLength: number = 100;
  private static nameHeight: number = 20;
  private static minClassHorizontalPadding: number = 20;
  private static textHorizontalPadding: number = 5;

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
          x += 200;
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

    this.ctx.fillText(
      c.name,
      x + c.width / 2 - size.width / 2 + 2.5,
      y + 15
    );
  }

  private drawClassProperties(x: number, y: number, c: Class): void {
    this.ctx.font = `${Draw.textSize}px arial`;

    console.log("drawing properties for ", c);

    // c.height = Draw.textSize * c.properties.length;

    // c.properties.forEach((p: string) => {
    //   this.ctx.fillText(p, x + 5, y + 5);
    //   y += Draw.textSize;
    // });

    c.properties.forEach((p: string, index: number) => {
      this.ctx.fillText(p, x + Draw.textHorizontalPadding, y + (index * Draw.textSize) + 5);
      y += Draw.textSize;
    });

    this.ctx.strokeStyle = "red";

    this.ctx.beginPath();
    this.ctx.rect(
      // this.currentX,
      // this.currentY + Draw.nameHeight + 5,
      x,
      c.height,
      c.width + Draw.textHorizontalPadding,
      y - c.height
    );

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

    console.log("drawing methods for for ", c);

    this.ctx.strokeStyle = "blue";

    c.methods.forEach((m: string) => {
      // draw normally if no new line characters
      if (m.indexOf("\n") === -1) {
        this.ctx.fillText(m, x + 5, y + 5);
      }
      else {
        // split on new line character
        const lines: string[] = m.split("\n");

        // draw each line
        lines.forEach((l: string, index) => {
          // dont indent
          if (index === 0) {
            this.ctx.fillText(`${l}`, x + 5, y + 5);
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
      c.width + 5,
      y - c.height
    );

    this.ctx.stroke();
    c.height = y;
  }

  private wrapText(c: Class): void {
    this.ctx.font = `bold ${Draw.textSize}px arial`;
    const size: TextMetrics = this.ctx.measureText(c.name);

    // width of name
    c.width = size.width;
    // height of name + padding
    c.height = Draw.textSize + 10;

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
      //   c.methods.forEach((m: string) => {
      //     let mSize: TextMetrics = this.ctx.measureText(m);

      //     let farIndex = m.length;

      //     while (mSize.width > Draw.maxLineLength) {
      //       console.log(`${m} is too long`);
      //       // atempt to add new line character after a comma
      //       const i = m.lastIndexOf(",", farIndex);
      //       farIndex = i;

      //       const shorter = m.slice(0, farIndex) + "\n" + m.slice(farIndex);
      //       console.log(shorter);

      //       if (farIndex === 0) {
      //         break;
      //       }
      //     }

      //     if (mSize.width > c.width) {
      //       c.width = mSize.width;
      //       c.height += Draw.textSize;
      //     }
      //   });

      // probably going to have to draw bottom up
      // fillText doesnt support multi line
      c.methods = c.methods.map((m: string) => {
        let mSize: TextMetrics = this.ctx.measureText(m);

        let farIndex = m.length;

        while (mSize.width > Draw.maxLineLength && farIndex !== -1) {
          console.log(`${m} is too long`);
          // atempt to add new line character after a comma
          const i = m.lastIndexOf(",", farIndex);
          farIndex = i;

          m = m.slice(0, farIndex) + "\n" + m.slice(farIndex);

          // update max width
          const mSplit = m.split("\n");
          mSplit.forEach((str: string) => {
            if (this.ctx.measureText(str).width > c.width) {
              c.width = this.ctx.measureText(str).width;
            }
          });

          console.log(m);

          //   if (farIndex === 0) {
          //     break;
          //   }
        }

        if (mSize.width > c.width) {
          c.width = mSize.width;
          c.height += Draw.textSize;
        }

        return m;
      });
    }

    // padding
    c.width += 10;
    c.height += 10;
  }

  // maybe have a position, top left offeset - similar to matrix translation
  private drawClass(x: number, y: number, c: Class): void {

    // DRAW MAIN CLASS
    this.drawClassName(x, y, c);
    if (c.properties) {
      this.drawClassProperties(x, y + c.height, c);
    }

    if (c.methods) {
      this.drawClassMethods(x, y + c.height, c);
    }

    if (c.children) {
      this.drawArrow({
        x: x + c.width / 2,
        y: c.height
      });
    }

    if (c.parent !== undefined) {
      this.drawLine({
        x: x + c.width / 2,
        y: y
      });
    }

    const originalX: number = x;

    // DRAW CHILDREN
    if (c.children) {
      c.children.forEach((ci: number, index: number) => {

        let childX = x;

        if (index > 0) {
          childX += this.classes[index - 1].width + Draw.minClassHorizontalPadding;
        }
        // const childX = x + c.width - this.classes[ci].width;
        const childY = y + c.height + 20;

        // use the previous child width



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

  private drawLine(start: IPoint, end?: IPoint) {
    // no end just little line
    this.ctx.beginPath();

    this.ctx.moveTo(start.x, start.y);
    if (!end) {
      this.ctx.lineTo(start.x, start.y - 5);
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }
}
