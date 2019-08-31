import { Colour, Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Matrix } from "./Matrix";
import { Utils } from "./Utils";

/**
 * # Polygon
 *
 * Represents a polygon by an array of IPoints.
 *
 * The polygon is the most important component for LGE.
 *
 * Each polygon keeps track of its centrepoint and bounding box if specified.
 *
 * The polygon stores the colour, fill colour and provides functions to translate and rotate.
 * The angle of the polygon is also stored for convenience.
 *
 * the decompose function decomposes the polygon into triangles and stored in the triangles property.
 *
 * <b> Note: </b> when translating and rotating the bounding box will be updated if present
 *
 * <b> Note: </b> The points are absolute and transform/rotate functions modify the points in place
 *
 * ## Example
 *
 * ```js
 *
 * // define the points
 * const points: IPoint[] = [
 *  {x: 100, y: 100},
 *  {x: 200, y: 100},
 *  {x: 150, y: 200}
 * ];
 *
 * // create the triangle defined by the points
 * const triangle: Polygon = new Polygon(points);
 *
 * // update the fill colour of the polygon to be red
 * triangle.fillColour = new Colour(255, 0, 0, 100);
 *
 * // output the points
 * console.log(triangle.points);
 *
 * // translate the polygon
 * triangle.translate(100, 100);
 *
 * // output the points
 * console.log(triangle.points);
 * ```
 *
 */
export class Polygon {
  public points: IPoint[];
  public triangles: Polygon[];
  public transformationMatrix: Matrix = new Matrix(null);
  public scale: number;
  public angle: number = 0;
  public colour: Colour;
  public fillColour: Colour | null = null;
  public centrePoint: IPoint;
  public boundingBox: Polygon;

  /**
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
   * decomposes the polygon into triangles.
   * returns the triangles but also updates the triangles property
   *
   * @returns Polygon[]
   */
  public decompose(): Polygon[] {
    if (this.points.length === 3) {
      // dont want to create a cycle so create new polygon
      this.triangles.push(new Polygon(this.points));
      return this.triangles;
    }

    const tempPoints: IPoint[] = this.points.slice(0, this.points.length);

    while (tempPoints.length > 3) {
      for (let i: number = 0; i < tempPoints.length; i++) {
        const prev: number = (i - 1 + tempPoints.length) % tempPoints.length;
        const next: number = (i + 1) % tempPoints.length;
        const t: IPoint[] = [tempPoints[i], tempPoints[prev], tempPoints[next]];
        let noneIn: boolean = true;

        for (let j: number = 0; j < tempPoints.length; j++) {
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
   *
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
    this.centrePoint.x += deltaX;
    this.centrePoint.y += deltaY;

    if (this.boundingBox) {
      this.boundingBox.translate(deltaX, deltaY);
    }
  }

  /**
   * Moves the centrepoint of the polygon to (x, y)
   *
   * @remarks not recommended
   * @param x x pos
   * @param y y pos
   */
  public moveTo(x: number, y: number): void {
    const offsets: IPoint[] = [];

    this.points.forEach((p: IPoint) => {
      offsets.push({
        x: this.centrePoint.x - p.x,
        y: this.centrePoint.y - p.y
      });
    });

    this.centrePoint = { x: x, y: y };

    for (let i: number = 0; i < offsets.length; i++) {
      this.points[i].x = this.centrePoint.x + offsets[i].x;
      this.points[i].y = this.centrePoint.y + offsets[i].y;
    }
  }

  /**
   * Rotate the polygon by angle degrees.
   * If no point is supplied the rotation point is the centrepoint of the polygon
   *
   * @param angle degrees
   * @param point optional point to rotate around
   */
  public rotate(angle: number, point?: IPoint): void {
    const theta: number = (angle * Math.PI) / 180;
    const cosTheta: number = Math.cos(theta);
    const sinTheta: number = Math.sin(theta);

    this.angle += theta;

    const tm: Matrix = this.transformationMatrix;

    // update the transformation matrix
    tm.values[0][0] = cosTheta;
    tm.values[0][1] = -sinTheta;
    tm.values[1][0] = sinTheta;
    tm.values[1][1] = cosTheta;

    // rotation point
    const rp: IPoint = point ? point : this.centrePoint;

    // update transformation matrix
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

  /**
   * Update the bounding box of the polygon
   */
  public updateBoundingBox(): void {
    this.boundingBox.points = Utils.calculateBoundingBox(this.points);
  }
}
