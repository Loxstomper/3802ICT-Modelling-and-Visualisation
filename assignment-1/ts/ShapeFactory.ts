import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";
/**
 * Factory to that returns shapes
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
  public square(
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
  public polygon(
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
