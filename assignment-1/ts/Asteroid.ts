import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";

export class Asteroid extends Polygon {
  // concave
  private static minRadius: number = 30;
  private static maxRadius: number = 40;
  private static nPoints: number = 24;

  /**
   * Creates points for asteroid polygon
   * nPoints equally spaced around a circle within min/max radius
   */
  private static generatePoints(centrePoint: IPoint): IPoint[] {
    const points: IPoint[] = [];

    const stepSize: number = (2 * Math.PI) / Asteroid.nPoints;
    let angle: number = 0;

    for (let i = 0; i < Asteroid.nPoints; i++) {
      const length: number =
        Utils.randomInt(Asteroid.maxRadius - Asteroid.minRadius + 1) +
        Asteroid.minRadius;

      points.push({
        x: centrePoint.x + length * Math.cos(angle),
        y: centrePoint.y + length * Math.sin(angle)
      });

      angle += stepSize;
    }

    return points;
  }

  public velocity: number;
  public rotationSpeed: number;
  public polygon: Polygon;
  // does this really need to be a polygon?
  public boundingBox: Polygon;

  constructor(centrePoint: IPoint) {
    super(Asteroid.generatePoints(centrePoint));
    this.boundingBox = new Polygon(Utils.calculateBoundingBox(this.points));
  }
}
