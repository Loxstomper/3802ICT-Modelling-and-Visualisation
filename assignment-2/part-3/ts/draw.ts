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
  private static nameSize: number = 12;
  private static textSize: number = 8;
  private static maxLineLength: number = 50;
  private static nameHeight: number = 20;

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
    classes.forEach((c: Class) => {
      this.currentX += 100;
      this.wrapText(c);
      this.drawClass(c);
    });
  }

  private drawClassName(c: Class): void {
    this.ctx.font = `bold ${Draw.nameSize}px arial`;
    const size: TextMetrics = this.ctx.measureText(c.name);

    this.ctx.beginPath();

    this.ctx.rect(
      this.currentX,
      this.currentY,
      c.width + 5,
      Draw.nameSize + 10
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
    this.ctx.font = `${Draw.nameSize}px arial`;

    console.log("drawing properties for ", c);

    const height = Draw.nameSize * c.properties.length;

    this.ctx.beginPath();
    this.ctx.rect(
      this.currentX,
      this.currentY + Draw.nameHeight,
      c.width + 5,
      height
    );

    this.ctx.stroke();

    let y = this.currentY + Draw.nameHeight + 10;

    c.properties.forEach((p: string) => {
      this.ctx.fillText(p, this.currentX + 5, y);
      y += Draw.textSize;
    });
  }

  private wrapText(c: Class): void {
    this.ctx.font = `bold ${Draw.nameSize}px arial`;
    const size: TextMetrics = this.ctx.measureText(c.name);

    // width of name
    c.width = size.width;
    // height of name + padding
    c.height = Draw.nameSize + 10;

    this.ctx.font = `${Draw.textSize}px arial`;
    if (c.properties) {
      c.height += 10;
      c.properties.forEach((p: string) => {
        const pSize: TextMetrics = this.ctx.measureText(p);
        if (pSize.width > c.width) {
          c.width = pSize.width + 20;
          c.height += Draw.textSize;
        }
      });
    }

    if (c.methods) {
      c.height += 10;
      c.methods.forEach((m: string) => {
        const mSize: TextMetrics = this.ctx.measureText(m);
        if (mSize.width > c.width) {
          c.width = mSize.width;
          c.height += Draw.textSize;
        }
      });
    }

    // padding
    c.width += 10;
    c.height += 10;
  }

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

    if (c.children) {
      this.drawArrow({
        x: this.currentX + c.width / 2,
        y: this.currentY + c.height
      });
    }

    if (c.parent) {
      this.drawLine({ x: this.currentX + c.width / 2, y: this.currentY });
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
