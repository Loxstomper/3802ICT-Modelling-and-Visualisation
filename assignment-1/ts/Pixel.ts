import { Colour } from "./Colour";
import { Rectangle } from "./Rectangle";

/**
 * # Pixel
 *
 * Represents a 'pixel'.
 *
 * The pixel size is provided when instantiating LGE.
 *
 * When a pixel is drawn it creates a rectangle and uses the HTML5 canvas API to draw this rectangle.
 * This is the only part of the engine that uses the HTML5 canvas API directly to draw.
 *
 * ## Example
 *
 * ```js
 * new Pixel(100, 100, 4, ctx, new Colour(255, 0, 0, 100));
 * ```
 */
export class Pixel {
  public colour: Colour;
  private ctx: CanvasRenderingContext2D;
  private rec: Rectangle;

  /**
   * Draws a 'pixel' on the canvas
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
