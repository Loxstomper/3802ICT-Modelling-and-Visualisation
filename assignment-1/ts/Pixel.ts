import { Colour } from "./Colour";
import { Rectangle } from "./Rectangle";

/**
 * Represents a 'pixel'
 */
export class Pixel {
  public colour: Colour;
  private ctx: CanvasRenderingContext2D;
  private rec: Rectangle;

  /**
   * Draws a pixel on the canvas
   *
   * @param x x pos
   * @param y y pos
   * @param size size
   * @param ctx canvas context
   * @param colour colour
   *
   */
  constructor(
    x: number,
    y: number,
    size: number,
    ctx: CanvasRenderingContext2D,
    colour: Colour
  ) {
    // console.log(x, y);
    this.rec = new Rectangle(
      Math.round(x),
      Math.round(y),
      ctx,
      size,
      size,
      colour
    );
    this.rec.draw();
  }
}
