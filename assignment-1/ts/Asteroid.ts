import { Colour, Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";

export class Asteroid extends Polygon {
  private static minRadius: number = 30;
  private static maxRadius: number = 40;
  private static nPoints: number = 24;
  private static maxVelocity: number = 50;
  private static colours: Colour[] = [
    Colours.brown1,
    Colours.brown2,
    Colours.brown3
  ];

  /**
   * Creates points for asteroid polygon
   * nPoints equally spaced around a circle within min/max radius
   *
   * @returns IPoint[]
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

  public boundingBox: Polygon;
  public resolution: IPoint;

  private velocity: IPoint = { x: 0, y: 0 };
  private rotationSpeed: number;

  constructor(centrePoint: IPoint, resolution: any) {
    // create the polygon
    super(Asteroid.generatePoints(centrePoint), true);

    // set resolution
    this.resolution = resolution;

    // rotation and velocity
    this.rotationSpeed = 10 + Utils.randomInt(90) - 50;
    this.velocity.x =
      Utils.randomInt(Asteroid.maxVelocity) - Asteroid.maxVelocity / 2;
    this.velocity.y =
      Utils.randomInt(Asteroid.maxVelocity) - Asteroid.maxVelocity / 2;

    // colour
    const colour = Asteroid.colours[Utils.randomInt(Asteroid.colours.length)];
    this.colour = colour;
    this.fillColour = colour;
    this.boundingBox.colour = Colours.green;
  }

  /**
   * Update physics
   * @param timeDelta time since last update
   */
  public update(timeDelta: number): void {
    // check if hit side of the canvas
    if (
      this.centrePoint.x + Asteroid.maxRadius >= this.resolution.x ||
      this.centrePoint.x - Asteroid.maxRadius <= 0
    ) {
      this.velocity.x *= -1;
    }

    // check if hit top/bottom of canvas
    if (
      this.centrePoint.y + Asteroid.maxRadius >= this.resolution.y ||
      this.centrePoint.y - Asteroid.maxRadius <= 0
    ) {
      this.velocity.y *= -1;
    }

    this.rotate(this.rotationSpeed * timeDelta);
    this.translate(this.velocity.x * timeDelta, this.velocity.y * timeDelta);
  }

  /**
   * handle collisions with other asteroids
   *
   * @param asteroids the asteroids array
   * @param currIndex the index of the current asteroid
   */
  public handleCollision(asteroids: Asteroid[], currIndex: number): void {
    const bb: IPoint[] = this.boundingBox.points;
    const bbWidth: number = bb[2].x - bb[0].x;
    const bbHeight: number = bb[3].y - bb[0].y;

    // check for collision
    for (let i: number = 0; i < asteroids.length; i++) {
      if (i === currIndex) {
        continue;
      }

      const abb: IPoint[] = asteroids[i].boundingBox.points;
      const abbWidth: number = abb[2].x - bb[0].x;
      const abbHeight: number = abb[3].y - bb[0].y;

      if (
        !(
          bb[0].x + bbWidth < abb[0].x || // bb is to the left of abb
          abb[0].x + abbWidth < bb[0].x || // abb is to the left of bb
          bb[0].y + bbHeight < abb[0].y || // bb is above abb
          abb[0].y + abbHeight < bb[0].y
        ) // abb is above bb
      ) {
        // invert velocity
        this.velocity.x *= -1;
        this.velocity.y *= -1;

        // translate a bit to bounce
        this.translate(this.velocity.x * 1.5, this.velocity.y * 1.5);
      }
    }
  }
}

export const asteroidFactory = (resolution: IPoint): Asteroid => {
  const x: number = 50 + Utils.randomInt(resolution.x - 100);
  const y: number = 50 + Utils.randomInt(resolution.y - 50);

  return new Asteroid({ x, y }, resolution);
};
