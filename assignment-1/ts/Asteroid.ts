import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";
import { Colour, Colours } from "./Colour";

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

  public velocity: any = { x: 0, y: 0 };
  public rotationSpeed: number;
  public polygon: Polygon;
  // does this really need to be a polygon?
  public boundingBox: Polygon;
  public resolution: any;

  constructor(centrePoint: IPoint, resolution: any) {
    super(Asteroid.generatePoints(centrePoint), true);
    this.resolution = resolution;
    this.rotationSpeed = 1 + Utils.randomInt(9) - 5;
    this.velocity.x = Utils.randomInt(5) - 2.5;
    this.velocity.y = Utils.randomInt(5) - 2.5;

    this.colour = Colours.black;
    this.fillColour = Colours.red;
    this.boundingBox.colour = Colours.green;

    console.log(this.boundingBox);
  }

  public update() {
    // use the bounding box for bounds checking
    const bb = this.boundingBox.points;

    if (
      bb[0].x <= 0 ||
      bb[0].y <= 0 ||
      bb[3].x >= this.resolution.x ||
      bb[3].y >= this.resolution.y
    ) {
      this.velocity.x *= -1;
      this.velocity.y *= -1;
    }

    // going to generate the bounding box twice...
    this.rotate(this.rotationSpeed);
    this.translate(this.velocity.x, this.velocity.y);
  }
}
