import { Asteroid } from "./Asteroid";
import { Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";

const controls = {
  BACKWARD: 83,
  FORWARD: 87,
  LEFT: 65,
  RIGHT: 68
};

export class Player {
  public body: Polygon[] = [];
  public boundingBox: Polygon;
  public velocityVector: IPoint = { x: 0, y: 0 };
  public rotationSpeed: number = 180;
  public angle: number = 0;
  public score: number = 0;
  public centrePoint: IPoint;
  public thrustPower: number = 10;
  public drag: number = 1;
  public resolution: IPoint;
  public flames: Polygon[];
  public isBoosted: boolean = false;

  constructor(resolution: any) {
    this.resolution = resolution;
    this.body = [
      new Polygon([
        { x: -40, y: 20 },
        { x: 40, y: 20 },
        { x: 40, y: -20 },
        { x: -40, y: -20 }
      ]),
      new Polygon([{ x: 40, y: 20 }, { x: 60, y: 0 }, { x: 40, y: -20 }]),
      new Polygon([{ x: -40, y: 20 }, { x: -40, y: 40 }, { x: -20, y: 20 }]),
      new Polygon([{ x: -40, y: -20 }, { x: -40, y: -40 }, { x: -20, y: -20 }]),
      new Polygon([
        { x: -20, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: -10 },
        { x: -20, y: -10 }
      ])
    ];

    // creates bounding box, use a dumby to initialise
    this.boundingBox = new Polygon(this.body[0].points, false);
    this.updateBoundingBox();
    this.boundingBox.colour = Colours.green;

    // set colour for the body components
    this.body[0].colour = Colours.silver;
    this.body[0].fillColour = Colours.silver;
    this.body[1].colour = Colours.silver;
    this.body[1].fillColour = Colours.silver;
    this.body[2].colour = Colours.silver;
    this.body[2].fillColour = Colours.silver;
    this.body[3].colour = Colours.silver;
    this.body[3].fillColour = Colours.silver;
    this.body[4].colour = Colours.blue;
    this.body[4].fillColour = Colours.blue;

    // flames
    // this.flames = [
    //   new Polygon([{ x: -40, y: 20 }, { x: -60, y: 10 }, { x: -40, y: 0 }]),
    //   new Polygon([{ x: -40, y: 0 }, { x: -60, y: -10 }, { x: -40, y: -20 }]),
    //   new Polygon([{ x: -40, y: 10 }, { x: -80, y: 0 }, { x: -40, y: -10 }])
    // ];

    this.flames = [
      new Polygon([
        { x: -40, y: 20 },
        { x: -60, y: 10 },
        { x: -40, y: 0 },
        { x: -60, y: -10 },
        { x: -40, y: 10 },
        { x: -80, y: 0 },
        { x: -40, y: -10 }
      ])
    ];

    this.flames.forEach((p: Polygon) => {
      p.colour = Colours.orange;
      p.fillColour = Colours.orange;
    });

    // move to the centre of the screen
    this.translate(this.resolution.x / 2, this.resolution.y / 2);
    this.centrePoint = Utils.calculateCentrePoint(this.boundingBox.points);
  }

  /**
   * Update the bounding box
   */
  public updateBoundingBox(): void {
    const points: IPoint[] = [];

    this.body.forEach((p: Polygon) => {
      points.push(...p.points);
    });

    this.boundingBox.points = Utils.calculateBoundingBox(points);
  }

  /**
   * Rotate by angle degrees
   *
   * @param angle degrees
   */
  public rotate(angle: number): void {
    this.angle += (angle * Math.PI) / 180;

    if (this.angle >= 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }
    if (this.angle <= -2 * Math.PI) {
      this.angle += 2 * Math.PI;
    }

    [...this.body, ...this.flames].forEach((p: Polygon) => {
      p.rotate(angle, this.centrePoint);
    });

    this.updateBoundingBox();
  }

  /**
   * Translate
   *
   * @param deltaX change in x
   * @param deltaY change in y
   */
  public translate(deltaX: number, deltaY: number): void {
    [...this.body, ...this.flames].forEach((p: Polygon) => {
      p.translate(deltaX, deltaY);
    });

    this.boundingBox.translate(deltaX, deltaY);
  }

  /**
   * Updates position based on user input
   *
   * @param pressedKeys current active keys
   * @param deltaTime time since last frame was rendered
   */
  public update(pressedKeys: any, deltaTime: number): void {
    this.isBoosted = false;

    // need to do if ladder for multiple key inputs

    if (pressedKeys[controls.FORWARD]) {
      this.velocityVector.y +=
        this.thrustPower * Math.sin(this.angle) * deltaTime;
      this.velocityVector.x +=
        this.thrustPower * Math.cos(this.angle) * deltaTime;

      this.isBoosted = true;
    }

    if (pressedKeys[controls.LEFT]) {
      this.rotate(-this.rotationSpeed * deltaTime);
    }

    if (pressedKeys[controls.RIGHT]) {
      this.rotate(this.rotationSpeed * deltaTime);
    }

    this.translate(this.velocityVector.x, this.velocityVector.y);

    // update centrepoint
    this.centrePoint.x += this.velocityVector.x;
    this.centrePoint.y += this.velocityVector.y;

    if (this.drag !== 1) {
      this.velocityVector.x *= this.drag;
      this.velocityVector.y *= this.drag;
    }

    if (
      this.centrePoint.y <= 50 ||
      this.centrePoint.y >= this.resolution.y - 50
    ) {
      this.velocityVector.y *= -0.5;
    }
    if (
      this.centrePoint.x <= 50 ||
      this.centrePoint.x >= this.resolution.x - 50
    ) {
      this.velocityVector.x *= -0.5;
    }
  }

  /**
   * Checks if there is any collisions with the asteroids.
   *
   *
   * @param asteroids Asteroid[]
   * @returns number of collisions
   */
  public handleCollision(asteroids: Asteroid[]): number {
    const bb: IPoint[] = this.boundingBox.points;
    const bbWidth: number = bb[2].x - bb[0].x;
    const bbHeight: number = bb[3].y - bb[0].y;

    let numberCollisions: number = 0;

    // check for collision
    for (let i: number = 0; i < asteroids.length; i++) {
      const abb: IPoint[] = asteroids[i].boundingBox.points;
      const abbWidth: number = abb[2].x - bb[0].x;
      const abbHeight: number = abb[3].y - bb[0].y;

      // check if the asteroid is off the canvas and remove it - prob get index issue tho...
      const cp: IPoint = asteroids[i].centrePoint;
      if (
        cp.x < 0 ||
        cp.x > this.resolution.x ||
        cp.y < 0 ||
        cp.y > this.resolution.y
      ) {
        asteroids.splice(i, 1);
        numberCollisions++;
        console.log("ran away");
        continue;
      }

      if (
        !(
          bb[0].x + bbWidth < abb[0].x || // bb is to the left of abb
          abb[0].x + abbWidth < bb[0].x || // abb is to the left of bb
          bb[0].y + bbHeight < abb[0].y || // bb is above abb
          abb[0].y + abbHeight < bb[0].y
        ) // abb is above bb
      ) {
        // delete asteroids[i];
        asteroids.splice(i, 1);
        numberCollisions++;
        this.score++;
      }
    }

    return numberCollisions;
  }
}
