import { Colour } from "./Colour";

export class Rectangle {
  public x: number;
  public y: number;
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public fill: string;

  /**
   *
   * @param x x position
   * @param y  y position
   * @param ctx canvas context
   * @param width width
   * @param height height
   * @param colour colour
   *
   */
  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colour: Colour
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;

    this.fill = colour.toString();
  }

  /**
   * draws to the canvas
   */
  public draw() {
    this.ctx.fillStyle = this.fill;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
