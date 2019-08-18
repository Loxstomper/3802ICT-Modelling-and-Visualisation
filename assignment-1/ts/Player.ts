import { Polygon } from "./Polygon";
import { Colours } from "./Colour";
import { Asteroid } from "./Asteroid";
import { IPoint } from "./IPoint";
import { Utils } from "./Utils";

const controls = {
  FORWARD: 87,
  BACKWARD: 83,
  LEFT: 65,
  RIGHT: 68
};

export class Player {
  public body: Polygon[] = [];
  public boundingBox: Polygon;
  public velocityVector: any = { x: 0, y: 0 };
  public velocity: number = 1;
  public maxVelocity: number = 5;
  public rotationSpeed: number = 4;
  public angle: number = 0;
  public score: number = 0;
  public centrePoint: IPoint;

  constructor() {
    // just using a single polygon for testing
    this.body.push(
      new Polygon([
        { x: 350, y: 350 },
        { x: 375, y: 325 },
        { x: 400, y: 350 },
        { x: 400, y: 400 },
        { x: 350, y: 400 }
      ])
    );

    // this.body.push(
    //   new Polygon([
    //     { x: 450, y: 350 },
    //     { x: 425, y: 325 },
    //     { x: 400, y: 350 },
    //     { x: 400, y: 400 }
    //   ])
    // );

    // this.body.push(
    //   new Polygon([
    //     { x: 350, y: 350 },
    //     { x: 325, y: 325 },
    //     { x: 325, y: 350 },
    //     { x: 350, y: 400 }
    //   ])
    // );

    // this.body.push(
    //   new Polygon([
    //     { x: -20, y: -20 },
    //     { x: -20, y: 20 },
    //     { x: 20, y: 20 },
    //     { x: 20, y: -20 }
    //   ])
    // );

    // creates
    this.updateBoundingBox();
    this.boundingBox.colour = Colours.green;

    this.centrePoint = Utils.calculateCentrePoint(this.boundingBox.points);

    this.body[0].fillColour = Colours.white;
    // this.body[1].fillColour = Colours.red;
    // this.body[2].fillColour = Colours.blue;
  }

  public updateBoundingBox(): void {
    // Utils.calculateBoundingBox on every polygon
    // then use that to create the bounding box

    const points = [];

    this.body.forEach((p: Polygon) => {
      points.push(...p.points);
    });

    this.boundingBox = new Polygon(Utils.calculateBoundingBox(points), false);
    this.boundingBox.colour = Colours.green;
    // console.log(this.boundingBox);
  }

  public rotate(angle: number): void {
    this.angle += angle;

    if (this.angle >= 360) {
      this.angle -= 360;
    }
    if (this.angle <= -360) {
      this.angle += 360;
    }

    // console.log(this.angle);

    this.body.forEach((p: Polygon) => {
      p.rotate(angle, this.centrePoint);
    });

    // this.boundingBox.rotate(angle, this.centrePoint);
    this.updateBoundingBox();
  }

  public translate(deltaX: number, deltaY: number): void {
    this.body.forEach((p: Polygon) => {
      p.translate(deltaX, deltaY);
    });

    this.boundingBox.translate(deltaX, deltaY);
  }

  public update(keyCode: number): void {
    switch (keyCode) {
      case controls.FORWARD:
        this.velocity++;
        break;

      case controls.BACKWARD:
        // this.velocity += 1;
        break;

      case controls.LEFT:
        this.rotate(-this.rotationSpeed);
        // this.velocityVector.x -= 1;
        break;

      case controls.RIGHT:
        this.rotate(this.rotationSpeed);
        // this.velocity.x += 1;
        break;
    }

    // clamp velocity
    this.velocity = Math.min(
      Math.max(-this.maxVelocity, this.velocity),
      this.maxVelocity
    );

    // negative because origin is top left
    this.velocityVector.y =
      this.velocity * -Math.cos(this.angle * (Math.PI / 180));
    this.velocityVector.x =
      this.velocity * Math.sin(this.angle * (Math.PI / 180));

    // this.velocityVector.y = -Math.cos(this.angle * (Math.PI / 180));
    // this.velocityVector.x = Math.sin(this.angle * (Math.PI / 180));

    if (this.centrePoint.y <= 50 || this.centrePoint.y >= 700) {
      this.velocityVector.y = 0;
    }
    if (this.centrePoint.x <= 50 || this.centrePoint.x >= 700) {
      this.velocityVector.x = 0;
    }
    this.translate(this.velocityVector.x, this.velocityVector.y);
    this.centrePoint = Utils.calculateCentrePoint(this.boundingBox.points);

    // console.log(this.velocity);
    // console.log(this.velocityVector);
  }

  public handleCollision(asteroids: Asteroid[]): number {
    const bb = this.boundingBox.points;
    const bbWidth = bb[2].x - bb[0].x;
    const bbHeight = bb[3].y - bb[0].y;

    let numberCollisions: number = 0;

    // check for collision
    for (let i = 0; i < asteroids.length; i++) {
      // this is really bad needs to be removed
      // check if the asteroid is off the canvas and remove it - prob get index issue tho...
      const cp: IPoint = asteroids[i].centrePoint;
      if (cp.x < 0 || cp.x > 800 || cp.y < 0 || cp.y > 800) {
        asteroids.splice(i, 1);
        numberCollisions++;
        console.log("ran away");
        continue;
      }
      // ---------------------------------------

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
        // delete asteroids[i];
        asteroids.splice(i, 1);
        numberCollisions++;
        this.score++;
      }
    }

    return numberCollisions;
  }
}
