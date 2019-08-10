import { Polygon } from "./Polygon";
import { Colours } from "./Colour";

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
  public velocity: number = -1;
  public maxVelocity: number = 5;
  public rotationSpeed: number = 10;
  public angle: number = 0;

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

    this.body[0].fillColour = Colours.black;
  }

  public updateBoundingBox(): void {
    // Utils.calculateBoundingBox on every polygon
    // then use that to create the bounding box
  }

  public rotate(angle: number): void {
    this.angle += angle;

    this.body.forEach((p: Polygon) => {
      p.rotate(angle);
    });
  }

  public translate(deltaX: number, deltaY: number): void {
    this.body.forEach((p: Polygon) => {
      p.translate(deltaX, deltaY);
    });
  }

  public update(keyCode: number): void {
    switch (keyCode) {
      case controls.FORWARD:
        this.velocity -= 1;
        break;

      case controls.BACKWARD:
        this.velocity += 1;
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

    this.velocity = Math.min(
      Math.max(-this.maxVelocity, this.velocity),
      this.maxVelocity
    );

    this.velocityVector.y = this.velocity = Math.cos(
      this.angle * (Math.PI / 180)
    );
    this.velocityVector.x = this.velocity = Math.sin(
      this.angle * (Math.PI / 180)
    );

    this.translate(this.velocityVector.x, this.velocityVector.y);

    console.log(this.velocity);
    console.log(this.velocityVector);
  }
}
