import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";

/**
 * # ShapeFactory
 * provides the ability to generate squares and random polygons using the Factory design pattern.
 *
 * ## Example
 *
 * ```js
 *  const square: Polygon = ShapeFactory.square(100, 100, 100, 100);
 *  const randomPolygon: Polygon = ShapeFactory.polygon(400, 400, 50, 50, 20);
 * ```
 */
export class ShapeFactory {
  /**
   * Creates a square polygon
   *
   * @param x x pos
   * @param y y pos
   * @param width width
   * @param height height
   *
   * @returns Polygon
   */
  public static square(
    x: number,
    y: number,
    width: number,
    height: number,
    boundingBox?: boolean
  ): Polygon {
    const points: IPoint[] = [];

    points.push({ x, y });
    points.push({ x: x + width, y });

    points.push({ x: x + width, y: y + height });
    points.push({ x, y: y + height });

    return new Polygon(points, boundingBox);
  }

  /**
   * Creates a polygon with n points
   *
   * @param x x pos
   * @param y y pos
   * @param width width
   * @param height height
   * @param nPoints number of points
   *
   * @returns Polygon
   */
  public static polygon(
    x: number,
    y: number,
    width: number,
    height: number,
    nPoints: number
  ) {
    const points: IPoint[] = [];

    for (let i = 0; i < nPoints; i++) {
      points.push({
        x: x + Utils.randomInt(width),
        y: y + Utils.randomInt(height)
      });
    }

    return new Polygon(points);
  }
}
