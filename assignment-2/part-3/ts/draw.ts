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
  private static minXPadding: number = 20;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private currentX: number = 0;
  private currentY: number = 0;

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

  public draw(classes: Class[]): void {
    classes.forEach((c: Class, index: number) => {
      this.wrapText(c);

      if (!c.parent) {
        this.drawClass(c);

        if (index > 0) {
          this.currentX += classes[index - 1].width + Draw.minXPadding;
        } else {
          this.currentX += 100;
        }
      }
    });
  }

  private drawClassName(c: Class): void {
    this.ctx.font = `bold ${Draw.textSize}px arial`;
    const size: TextMetrics = this.ctx.measureText(c.name);

    this.ctx.strokeStyle = "black";

    this.ctx.beginPath();

    this.ctx.rect(
      this.currentX,
      this.currentY,
      c.width + 5,
      Draw.textSize + 10
    );

    this.ctx.stroke();

    this.ctx.fillText(
      c.name,
      //   this.currentX + size.width / 2,
      this.currentX + c.width / 2 - size.width / 2 + 2.5,
      this.currentY + 15
    );
  }

  private drawClassProperties(c: Class): void {
    this.ctx.font = `${Draw.textSize}px arial`;

    console.log("drawing properties for ", c);

    const height = Draw.textSize * c.properties.length;

    // let y =
    //   this.currentY +
    //   Draw.nameHeight +
    //   10 +
    //   c.properties.length * Draw.textSize;
    let y = c.height;

    c.properties.forEach((p: string) => {
      this.ctx.fillText(p, this.currentX + 5, y);
      y += Draw.textSize;
    });

    this.ctx.strokeStyle = "red";

    this.ctx.beginPath();
    this.ctx.rect(
      this.currentX,
      this.currentY + Draw.nameHeight + 5,
      c.width + 5,
      height + 10
    );

    this.ctx.stroke();

    c.height = y;
  }

  private drawClassMethods(c: Class): void {
    this.ctx.font = `${Draw.textSize}px arial`;

    console.log("drawing methods for for ", c);

    const height = Draw.textSize * c.methods.length;

    // this.ctx.beginPath();
    // this.ctx.rect(
    //   this.currentX,
    //   this.currentY + Draw.nameHeight,
    //   c.width + 5,
    //   height
    // );

    // this.ctx.stroke();
    this.ctx.strokeStyle = "blue";

    // let y = this.currentY + Draw.nameHeight;
    let y = this.currentY + c.height;

    c.methods.forEach((m: string) => {
      if (!m.indexOf("\n")) {
        this.ctx.fillText(m, this.currentX + 5, y);
      } else {
        const lines: string[] = m.split("\n");

        lines.forEach((l: string, index) => {
          if (index === 0) {
            this.ctx.fillText(`${l}`, this.currentX + 5, y);
          } else {
            this.ctx.fillText(`\t\t${l}`, this.currentX + 5, y);
          }
          y += Draw.textSize / 2;
        });
      }

      y += Draw.textSize;
    });

    this.ctx.beginPath();
    this.ctx.rect(
      this.currentX,
      // this.currentY + Draw.nameHeight + c.properties.length * 20,
      // this.currentY + Draw.nameHeight + 5 + c.properties.length * 25,
      c.height,
      c.width + 5,
      y - this.currentY
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
  private drawClass(c: Class): void {
    this.wrapText(c);

    // this.ctx.fillText(
    //   c.name,
    //   this.currentX + horizontalPadding,
    //   this.currentY + horizontalPadding
    // );
    // this.currentX += horizontalPadding + minimumX;
    this.drawClassName(c);
    if (c.properties) {
      this.drawClassProperties(c);
    }

    if (c.methods) {
      this.drawClassMethods(c);
    }

    if (c.children) {
      this.drawArrow({
        x: this.currentX + c.width / 2,
        y: c.height
      });
    }

    if (c.parent !== undefined) {
      this.drawLine({
        x: this.currentX + c.width / 2,
        y: this.currentY
      });
    }

    // c.children.forEach((cc: Class) => {
    //   this.drawClass(cc);
    // });
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
