import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";
import { Colour, Colours } from "./Colour";

export class Asteroid extends Polygon {
  // concave
  private static minRadius: number = 30;
  private static maxRadius: number = 40;
  private static nPoints: number = 24;
  private static colours: Colour[] = [
    Colours.brown,
    new Colour(110, 44, 0, 100),
    new Colour(93, 64, 55, 100)
  ];

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
  public ID: number;

  constructor(centrePoint: IPoint, resolution: any) {
    super(Asteroid.generatePoints(centrePoint), true);
    this.resolution = resolution;
    this.rotationSpeed = 10 + Utils.randomInt(90) - 50;
    this.velocity.x = Utils.randomInt(50) - 25;
    this.velocity.y = Utils.randomInt(50) - 25;

    const colour = Asteroid.colours[Utils.randomInt(Asteroid.colours.length)];
    this.colour = colour;
    this.fillColour = colour;
    this.boundingBox.colour = Colours.green;

    // console.log(this.boundingBox);
  }

  public update(timeDelta: number) {
    // use the bounding box for bounds checking
    const bb = this.boundingBox.points;

    // if (
    //   bb[0].x <= 0 ||
    //   bb[0].y <= 0 ||
    //   bb[3].x >= this.resolution.x ||
    //   bb[3].y >= this.resolution.y
    // ) {
    //   this.velocity.x *= -1;
    //   this.velocity.y *= -1;
    // }

    if (
      this.centrePoint.x + Asteroid.maxRadius >= this.resolution.x ||
      this.centrePoint.x - Asteroid.maxRadius <= 0
    ) {
      this.velocity.x *= -1;
    }

    if (
      this.centrePoint.y + Asteroid.maxRadius >= this.resolution.y ||
      this.centrePoint.y - Asteroid.maxRadius <= 0
    ) {
      this.velocity.y *= -1;
    }

    // going to generate the bounding box twice...
    this.rotate(this.rotationSpeed * timeDelta);
    this.translate(this.velocity.x * timeDelta, this.velocity.y * timeDelta);
    // this.updateBoundingBox();
    this.boundingBox.colour = Colours.green;
  }

  public handleCollision(asteroids: Asteroid[], currIndex: number) {
    const bb = this.boundingBox.points;
    const bbWidth = bb[2].x - bb[0].x;
    const bbHeight = bb[3].y - bb[0].y;

    // check for collision
    for (let i = 0; i < asteroids.length; i++) {
      if (i === currIndex) {
        continue;
      }

      const abb = asteroids[i].boundingBox.points;
      const abbWidth = abb[2].x - bb[0].x;
      const abbHeight = abb[3].y - bb[0].y;

      // double check this!
      if (
        !(
          bb[0].x + bbWidth < abb[0].x || // bb is to the left of abb
          abb[0].x + abbWidth < bb[0].x || // abb is to the left of bb
          bb[0].y + bbHeight < abb[0].y || // bb is above abb
          abb[0].y + abbHeight < bb[0].y
        ) // abb is above bb
      ) {
        this.velocity.x *= -1;
        this.velocity.y *= -1;
      }
    }
  }
}
