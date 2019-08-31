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
  public rotationSpeed: number = 180;
  public angle: number = 0;
  public score: number = 0;
  public centrePoint: IPoint;
  public thrustPower: number = 10;
  public drag: number = 0.995;
  public resolution: any;
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

    // creates
    this.updateBoundingBox();
    this.boundingBox.colour = Colours.green;

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
    this.flames = [
      new Polygon([{ x: -40, y: 20 }, { x: -60, y: 10 }, { x: -40, y: 0 }]),
      new Polygon([{ x: -40, y: 0 }, { x: -60, y: -10 }, { x: -40, y: -20 }]),
      new Polygon([{ x: -40, y: 10 }, { x: -80, y: 0 }, { x: -40, y: -10 }])
    ];

    this.flames.forEach((p: Polygon) => {
      p.colour = Colours.orange;
      p.fillColour = Colours.orange;
    });

    this.translate(this.resolution.x / 2, this.resolution.y / 2);
    this.centrePoint = Utils.calculateCentrePoint(this.boundingBox.points);
    // this.centrePoint = Utils.calculateCentrePoint(this.body[0].points);

    // this.centrePoint = Utils.calculateCentrePoint(x);

    // this.centrePoint = { x: 400, y: 400 };

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
    this.angle += (angle * Math.PI) / 180;

    if (this.angle >= 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }
    if (this.angle <= -2 * Math.PI) {
      this.angle += 2 * Math.PI;
    }

    // console.log(this.angle);

    [...this.body, ...this.flames].forEach((p: Polygon) => {
      p.rotate(angle, this.centrePoint);
    });

    // this.boundingBox.rotate(angle, this.centrePoint);
    this.updateBoundingBox();
    // this.boundingBox.rotate(angle, this.centrePoint);
  }

  public translate(deltaX: number, deltaY: number): void {
    // this.body.forEach((p: Polygon) => {
    //   p.translate(deltaX, deltaY);
    // });

    // this.flames.forEach((p: Polygon) => {
    //   p.translate(deltaX, deltaY);
    // });

    [...this.body, ...this.flames].forEach((p: Polygon) => {
      p.translate(deltaX, deltaY);
    });

    this.boundingBox.translate(deltaX, deltaY);
  }

  public update(pressedKeys: any, deltaTime: number): void {
    this.isBoosted = false;

    // need to do if/else ladder for multiple key inputs

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

  public updateOLD(keyCode: number): void {
    switch (keyCode) {
      case controls.FORWARD:
        this.velocity++;
        break;

      case controls.BACKWARD:
        // this.velocity += 1;
        break;

      case controls.LEFT:
        this.rotate(-this.rotationSpeed);
        break;

      case controls.RIGHT:
        this.rotate(this.rotationSpeed);
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
