import { IPoint } from "./IPoint";
import { Matrix } from "./Matrix";
import { Utils } from "./Utils";
import { Colour } from "./Colour";
/**
 * Represents a polygon
 */
export class Polygon {
  public points: IPoint[];
  public triangles: Polygon[];
  public translationMatrix: Matrix = new Matrix(null);
  public rotationMatrix: Matrix = new Matrix(null);
  public transformationMatrix: Matrix = new Matrix(null);
  public scale: number;
  public angle: number;
  public colour: Colour;
  public fillColour: Colour;
  public centrePoint: IPoint;

  /**
   *
   * @param points points that represent the polygon
   */
  constructor(points: IPoint[]) {
    this.points = points;
    this.triangles = [];
    this.centrePoint = Utils.calculateCentrePoint(points);

    this.scale = 1;
    this.angle = 0;

    // init the matrices
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
    // update value
    this.translationMatrix.values[0][2] = deltaX;
    this.translationMatrix.values[1][2] = deltaY;

    // update all the points
    this.points.forEach((p: IPoint) => {
      const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
      const res: Matrix = this.translationMatrix.multiply(pMatrix);

      p.x = res.values[0][0];
      p.y = res.values[1][0];
    });
  }

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

  public rotate(angle: number): void {
    // makes it easier
    const prevPos = this.centrePoint;

    // move to origin
    this.moveTo(0, 0);

    // rotate
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    const rv = this.rotationMatrix.values;

    rv[0][0] = cosTheta;
    rv[0][1] = -sinTheta;
    rv[1][0] = sinTheta;
    rv[1][1] = cosTheta;

    // update all the points
    this.points.forEach((p: IPoint) => {
      const pMatrix: Matrix = new Matrix([[p.x], [p.y], [1]]);
      const res: Matrix = this.rotationMatrix.multiply(pMatrix);

      p.x = res.values[0][0];
      p.y = res.values[1][0];
    });

    // move back
    this.moveTo(prevPos.x, prevPos.y);
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
