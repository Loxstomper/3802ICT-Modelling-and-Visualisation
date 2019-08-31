import { Colour } from "./Colour";

/**
 * # Rectangle
 *
 * The Rectangle is drawn using the HTML5 canvas API and its main purpose is to be used by the Pixel class.
 *
 * ## Example
 *
 * ```js
 * // instantiate the rectangle
 * const rect: Rectangle = new Rectangle(100, 100, ctx, 200, 50, new Colour(255, 0, 0, 100));
 *
 * // draw the rectangle
 * // ctx.fillStyle = this.fill;
 * // ctx.fillRect(this.x, this.y, this.width, this.height);
 * rect.draw();
 *
 * ```
 */
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
