import { Colour, Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Matrix } from "./Matrix";
import { Utils } from "./Utils";

/**
 * Represents a polygon
 */
export class Polygon {
  public points: IPoint[];
  public triangles: Polygon[];
  public transformationMatrix: Matrix = new Matrix(null);
  public scale: number;
  public angle: number;
  public colour: Colour;
  public fillColour: Colour | null = null;
  public centrePoint: IPoint;
  public boundingBox: Polygon;

  /**
   *
   * @param points points that represent the polygon
   */
  constructor(points: IPoint[], hasBoundingBox?: boolean) {
    this.points = points;
    this.triangles = [];
    this.centrePoint = Utils.calculateCentrePoint(points);

    this.colour = Colours.black;

    if (hasBoundingBox) {
      this.boundingBox = new Polygon(Utils.calculateBoundingBox(this.points));
      this.boundingBox.colour = Colours.green;
    }

    this.scale = 1;
  }

  /**
   * decomposes the polygon into triangles
   * @returns an array of polygons
   */
  public decompose(): Polygon[] {
    if (this.points.length === 3) {
      // dont want to create a cycle so create new polygon
      this.triangles.push(new Polygon(this.points));
      return this.triangles;
    }

    const tempPoints = this.points.slice(0, this.points.length);

    while (tempPoints.length > 3) {
      for (let i = 0; i < tempPoints.length; i++) {
        const prev = (i - 1 + tempPoints.length) % tempPoints.length;
        const next = (i + 1) % tempPoints.length;
        const t = [tempPoints[i], tempPoints[prev], tempPoints[next]];
        let noneIn = true;

        for (let j = 0; j < tempPoints.length; j++) {
          if (
            j !== i &&
            j !== next &&
            Utils.insideTriangle(tempPoints[j], new Polygon(t))
          ) {
            noneIn = false;
            break;
          }
        }

        if (noneIn) {
          tempPoints.splice(i, 1);
          this.triangles.push(new Polygon(t));
          break;
        }
      }
    }

    this.triangles.push(new Polygon(tempPoints));
    return this.triangles;
  }

  /**
   * Translate position by deltaX, deltaY
   * @param deltaX change in x
   * @param deltaY change in y
   *
   * @returns Polygon
   */
  public translate(deltaX: number, deltaY: number): void {
    // update values
    this.transformationMatrix.values[0][2] = deltaX;
    this.transformationMatrix.values[1][2] = deltaY;

    // update all the points
    this.points.forEach((p: IPoint, i: number) => {
      const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
      const res: Matrix = this.transformationMatrix.multiply(pMatrix);

      this.points[i] = { x: res.values[0][0], y: res.values[1][0] };
    });

    // update values [reset]
    this.transformationMatrix.values[0][2] = 0;
    this.transformationMatrix.values[1][2] = 0;

    // update centrepoint and bounding box
    // this.centrePoint = Utils.calculateCentrePoint(this.points);
    this.centrePoint.x += deltaX;
    this.centrePoint.y += deltaY;

    if (this.boundingBox) {
      // this.boundingBox = new Polygon(Utils.calculateBoundingBox(this.points));
      this.boundingBox.translate(deltaX, deltaY);
    }
  }

  // dont use this
  // moves centrepoint to location
  public moveTo(x: number, y: number): void {
    const offsets: IPoint[] = [];

    this.points.forEach((p: IPoint) => {
      offsets.push({
        x: this.centrePoint.x - p.x,
        y: this.centrePoint.y - p.y
      });
    });

    this.centrePoint = { x: x, y: y };

    for (let i = 0; i < offsets.length; i++) {
      this.points[i].x = this.centrePoint.x + offsets[i].x;
      this.points[i].y = this.centrePoint.y + offsets[i].y;
    }
  }

  public rotate(angle: number, point?: IPoint): void {
    const theta: number = (angle * Math.PI) / 180;
    const cosTheta: number = Math.cos(theta);
    const sinTheta: number = Math.sin(theta);

    const tm = this.transformationMatrix;

    // update the transformation matrix
    tm.values[0][0] = cosTheta;
    tm.values[0][1] = -sinTheta;
    tm.values[1][0] = sinTheta;
    tm.values[1][1] = cosTheta;

    // rotation point
    const rp: IPoint = point ? point : this.centrePoint;

    // this can be incorporated into another matrix operation
    // tm.values[0][2] = rp.x - cosTheta * rp.x - -sinTheta * rp.y;
    // tm.values[1][2] = rp.y - sinTheta * rp.y - cosTheta * rp.y;

    // tm.values[0][2] = rp.y - cosTheta * rp.y - -sinTheta * rp.x;
    // tm.values[1][2] = rp.x - sinTheta * rp.x - cosTheta * rp.x;

    // tm.values[0][2] = rp.y - cosTheta * rp.y - -sinTheta * rp.x;
    // tm.values[1][2] = rp.x - sinTheta * rp.x - cosTheta * rp.x;

    tm.values = [
      [cosTheta, -sinTheta, rp.x - cosTheta * rp.x - -sinTheta * rp.y],
      [sinTheta, cosTheta, rp.y - sinTheta * rp.x - cosTheta * rp.y],
      [0, 0, 1]
    ];

    // update all the points
    this.points.forEach((p: IPoint, i: number) => {
      const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
      const res: Matrix = tm.multiply(pMatrix);

      this.points[i] = { x: res.values[0][0], y: res.values[1][0] };
    });

    // update the bounding box
    // if (this.boundingBox !== undefined) {
    //   this.boundingBox.points.forEach((p: IPoint, i: number) => {
    //     const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
    //     const res: Matrix = tm.multiply(pMatrix);

    //     this.boundingBox.points[i] = {
    //       x: res.values[0][0],
    //       y: res.values[1][0]
    //     };
    //   });
    // }

    if (this.boundingBox !== undefined) {
      this.updateBoundingBox();
    }

    // update the transformation matrix [reset angle]
    tm.values[0][0] = 1;
    tm.values[0][1] = 0;
    tm.values[1][0] = 0;
    tm.values[1][1] = 1;
    // translation
    tm.values[0][2] = 0;
    tm.values[1][2] = 0;
  }

  public updateBoundingBox(): void {
    this.boundingBox = new Polygon(Utils.calculateBoundingBox(this.points));
  }

  public newRotate(angle: number): void {
    const theta: number = (angle * Math.PI) / 180;
    const cosTheta: number = Math.cos(theta);
    const sinTheta: number = Math.sin(theta);

    const tm = this.transformationMatrix;
    const tmOld = JSON.parse(JSON.stringify(tm));
    const rm = JSON.parse(JSON.stringify(tm));

    // update all the points
    this.points.forEach((p: IPoint, i: number) => {
      // const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
      const pMatrix: Matrix = new Matrix(null);
      pMatrix.values[0][2] = p.x;
      pMatrix.values[1][2] = p.y;

      const res: Matrix = tm.multiply(pMatrix);

      this.points[i] = { x: res.values[0][0], y: res.values[1][0] };
    });
  }

  /**
   * Scales all the points by x and y
   * @param x x multiplier
   * @param y y multiplier
   *
   * @returns Polygon
   */
  // public scale(x: number, y: number): Polygon {
  //   this.points.forEach((p: IPoint) => {
  //     p.x = Math.round(p.x * x);
  //     p.y = Math.round(p.y * y);
  //   });
  //   return this;
  // }
}
