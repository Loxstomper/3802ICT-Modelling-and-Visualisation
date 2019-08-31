import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";

/**
 * # Utils
 *
 * Utility Class used throughout LGE and the game engine.
 *
 */
export class Utils {
  /**
   * Generates a random number [0...max]
   * @param max max number
   * @returns random number between 0 and max
   */
  public static randomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Are the points on the same side
   *
   * @param a IPoint
   * @param b IPoint
   * @param l1 line1
   * @param l2 line2
   *
   * @returns boolean
   */
  public static sameSide(
    a: IPoint,
    b: IPoint,
    l1: IPoint,
    l2: IPoint
  ): boolean {
    const apt = (a.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (a.y - l1.y);
    const bpt = (b.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (b.y - l1.y);

    return apt * bpt > 0;
  }

  /**
   * Is a IPoint in a triangle
   *
   * @param p IPoint
   * @param t triangle
   *
   * @returns boolean
   */
  public static insideTriangle(p: IPoint, t: Polygon): boolean {
    const [a, b, c] = t.points;

    return (
      this.sameSide(p, a, b, c) &&
      this.sameSide(p, b, a, c) &&
      this.sameSide(p, c, a, b)
    );
  }

  /**
   * Calculates a rectangle bounding box from the supplied points
   *
   * @param points IPoint[]
   * @returns IPoint[]
   */
  public static calculateBoundingBox(points: IPoint[]): IPoint[] {
    let minX: number = Number.POSITIVE_INFINITY;
    let minY: number = Number.POSITIVE_INFINITY;
    let maxX: number = Number.NEGATIVE_INFINITY;
    let maxY: number = Number.NEGATIVE_INFINITY;

    // better than doing 4 reduces
    for (const p of points) {
      if (p.x < minX) {
        minX = p.x;
      }
      if (p.x > maxX) {
        maxX = p.x;
      }
      if (p.y < minY) {
        minY = p.y;
      }
      if (p.y > maxY) {
        maxY = p.y;
      }
    }

    return [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
    ];
  }

  /**
   * Calculates the centre point from a series of points from the bounding box
   *
   * @param points IPoint[]
   * @returns IPoint
   */
  public static calculateCentrePoint(points: IPoint[]): IPoint {
    const boundingBox = Utils.calculateBoundingBox(points);

    return {
      x: (boundingBox[2].x + boundingBox[0].x) / 2,
      y: (boundingBox[3].y + boundingBox[0].y) / 2
    };
  }
}
