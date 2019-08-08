import { Colour, Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Matrix } from "./Matrix";
import { Pixel } from "./Pixel";
import { Polygon } from "./Polygon";
import { Utils } from "./Utils";

/**
 * Lochie Graphics Engine
 */
export class LGE {
  private PIXEL_SIZE: number;
  private fillMethod: string | null;
  // maybe make these a stack too?
  private translationMatrix: Matrix;
  private rotationMatrix: Matrix;
  private transformationMatrices: Matrix[] = [];
  private ctx: CanvasRenderingContext2D;
  private resolution: any;

  /**
   *
   * @param ctx canvas ctx
   * @param PIXEL_SIZE size of each pixel
   * @param fillMethod 'scanLine'/null/'other'
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    PIXEL_SIZE: number,
    fillMethod: string | null
  ) {
    this.ctx = ctx;
    this.PIXEL_SIZE = PIXEL_SIZE;
    this.fillMethod = fillMethod;

    const canvas: any = ctx.canvas;

    this.resolution = { x: canvas.width, y: canvas.height };

    this.translationMatrix = new Matrix([[0], [0]]);
    this.rotationMatrix = new Matrix([[1, 0], [0, 1]]);
    this.updateTransformationMatrix();

    console.log("Transformation matrices: ");
    console.log(this.transformationMatrices);
  }

  /**
   * combines the translation matrix and rotation matrix into a single one and adds to stack
   */
  public updateTransformationMatrix(): Matrix {
    const r = this.rotationMatrix;
    const t = this.translationMatrix;

    const values = [
      [r.values[0][0], r.values[0][1], t.values[0][0]],
      [r.values[1][0], r.values[1][1], t.values[1][0]],
      [0, 0, 1]
    ];

    const res: Matrix = new Matrix(values);
    this.transformationMatrices.push(res);

    console.log("translation matrix");
    console.log(t);

    console.log("rotation matrix");
    console.log(r);

    console.log("Transformation Matrix");
    console.log(res);

    return res;
  }

  public setRotation(angle: number): void {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    this.rotationMatrix.values = [[cosTheta, -sinTheta], [sinTheta, cosTheta]];

    this.updateTransformationMatrix();
  }

  public setTranslation(dX: number, dY: number): void {
    this.translationMatrix.values = [[dX], [dY]];

    this.updateTransformationMatrix();
  }

  /**
   * scale points
   * @remarks doesn't actual scale due to issues
   *
   * @param points points to be scaled
   * @returns IPoint[]
   */
  public scalePoints(points: IPoint[]): IPoint[] {
    return points;

    // points.forEach( (p : IPoint) => {
    //     p.x = Math.floor(p.x) * this.PIXEL_SIZE;
    //     p.y = Math.floor(p.y) * this.PIXEL_SIZE;
    // })

    // return points;
  }

  /**
   * Draws a coloured line between two points
   * @param start first IPoint
   * @param end end IPoint
   * @param colour Colour
   */
  public drawLine(start: IPoint, end: IPoint, colour: Colour): void {
    let p0: IPoint;
    let p1: IPoint;

    [p0, p1] = this.scalePoints([start, end]);

    // const dx = p1.x - p0.x,
    //       dy = p1.y - p0.y,
    //       s  = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) / this.PIXEL_SIZE : Math.abs(dy) / this.PIXEL_SIZE,
    //       xi = dx * 1.0 / s,
    //       yi = dy * 1.0 / s

    // let x = p0.x,
    //     y = p0.y,
    //     out = []

    // out.push({x: x, y: y});

    // for (let i = 0; i < s; i++) {
    //     x += xi;
    //     y += yi;
    //     out.push({x: x, y: y});
    // }

    // // out.map(pos => new Pixel(Math.floor(pos.x), Math.floor(pos.y), this.PIXEL_SIZE, this.ctx, colour));
    // out.map(pos => new Pixel(pos.x, pos.y, this.PIXEL_SIZE, this.ctx, colour));

    const dx = Math.ceil(p1.x - p0.x);
    const dy = Math.ceil(p1.y - p0.y);
    const steps =
      Math.abs(dx) > Math.abs(dy)
        ? Math.ceil(Math.abs(dx) / this.PIXEL_SIZE)
        : Math.ceil(Math.abs(dy) / this.PIXEL_SIZE);

    if (steps === 0) {
      // tslint:disable-next-line: no-unused-expression
      new Pixel(p0.x, p0.y, this.PIXEL_SIZE, this.ctx, colour);
      return;
    }

    const xInc = dx / steps;
    const yInc = dy / steps;

    let x = p0.x;
    let y = p0.y;

    for (let i = 0; i < steps; i++) {
      // tslint:disable-next-line: no-unused-expression
      new Pixel(x, y, this.PIXEL_SIZE, this.ctx, colour);
      x += xInc;
      y += yInc;
    }
  }

  /**
   * Draws lines between the points
   * @param points IPoint[]
   * @param colour Colour
   */
  public drawPath(points: IPoint[], colour: Colour): void {
    for (let i = 0; i < points.length; i++) {
      this.drawLine(points[i], points[i + 1], colour);
    }
  }

  /**
   * Fills a polygon with the given colour
   * @param poly Polygon
   * @param colour Colour
   */
  public scanLineFill(poly: Polygon, colour: Colour): void {
    const points: IPoint[] = poly.points;

    const minY = points.reduce((prev, curr) => (prev.y < curr.y ? prev : curr))
      .y;
    const maxY = points.reduce((prev, curr) => (prev.y > curr.y ? prev : curr))
      .y;

    let start = points[points.length - 1];
    const edges = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < points.length; i++) {
      edges.push({ 0: start, 1: points[i] });
      start = points[i];
    }

    for (let y = minY; y < maxY; y += this.PIXEL_SIZE) {
      const Xs = [];

      // tslint:disable-next-line: one-variable-per-declaration
      let x, x1, x2, y1, y2, deltaX, deltaY;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < edges.length; i++) {
        x1 = edges[i][0].x;
        x2 = edges[i][1].x;

        y1 = edges[i][0].y;
        y2 = edges[i][1].y;

        deltaX = x2 - x1;
        deltaY = y2 - y1;

        x = x1 + (deltaX / deltaY) * (y - y1);

        // x = Math.round(x1 * deltaX / deltaY * (y - y1));

        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
          Xs.push(x);
        }
      }

      Xs.sort();

      for (let xi = 0; xi < Xs.length - 1; xi += 2) {
        // let left  = Xs[xi]     % 1 == 0 ? Xs[xi] : Math.ceil(Xs[xi]);
        // let right = Xs[xi + 1] % 1 == 0 ? Xs[xi + 1] : Math.floor(Xs[xi + 1]);

        const left = Xs[xi];
        const right = Xs[xi + 1];

        // console.log("BEFORE: ", left, right);

        // left  = Xs[xi]     % 1 === 0 ? Xs[xi]     : Math.ceil(Xs[xi]);
        // right = Xs[xi + 1] % 1 === 0 ? Xs[xi + 1] : Math.floor(Xs[xi]);

        // console.log("AFTER : ", left, right);

        this.drawLine({ x: left, y }, { x: right, y }, colour);
      }
    }

    // this.drawPolygon(poly, colour);
  }

  /**
   * Other algorithm to fill a polygon
   * @param poly Polygon
   * @param colour Colour
   */
  public otherFill(poly: Polygon, colour: Colour): void {}

  /**
   * Fills a polygon based on the method decided on at initialization
   * @param poly Polygon
   * @param colour Colour
   */
  public fillPolygon(poly: Polygon, colour: Colour): void {
    if (this.fillMethod === null || this.fillMethod === "scanLine") {
      // dont decompose if the polygon is a triangle
      const triangles: Polygon[] =
        poly.points.length === 3 ? [poly] : poly.decompose();

      triangles.forEach((t: Polygon) => {
        this.scanLineFill(t, colour);
        this.drawPolygon(t, Colours.red);
      });
    } else {
      // this.otherFill(poly, colour);
    }
  }

  /**
   * Draws the polygon
   * @param poly Polygon
   * @param colour Colour
   */
  public drawPolygon(poly: Polygon, colour: Colour): void {
    const points = poly.points;

    // multiply these points by the translation matrix
    // points.forEach(p => {
    //     Utils.matrixMultiply([p.x, p.y, 0], this.translationMatrixs[this.translationMatrixs.length - 1]);
    // });

    console.log("Updating points");

    points.forEach(p => {
      const pMatrix = new Matrix([[p.x], [p.y], [1]]);
      console.log("The transformation matrix used is");
      console.log(
        this.transformationMatrices[this.transformationMatrices.length - 1]
      );
      const res: Matrix = this.transformationMatrices[
        this.transformationMatrices.length - 1
      ].multiply(pMatrix);
      console.log("original");
      console.log(pMatrix);

      console.log("after");
      console.log(res);

      p.x = res.values[0][0];
      p.y = res.values[1][0];
    });

    for (let i = 0; i < points.length - 1; i++) {
      this.drawLine(points[i], points[i + 1], colour);
    }

    this.drawLine(points[points.length - 1], points[0], colour);
  }

  public drawPolygonBuffer(buffer: any): void {
    buffer.forEach(x => {
      this.drawPolygon(x.poly, x.colour);
    });
  }

  /**
   * Draws a triangle from 3 points
   * @param points Points
   * @param colour Colour
   */
  public drawTriangle(points: IPoint[], colour: Colour): void {
    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Fills a triangle from 3 points
   * @param points IPoint[]
   * @param colour Colour
   */
  public fillTriangle(points: IPoint[], colour: Colour): void {
    this.fillPolygon(new Polygon(points), colour);
  }

  /**
   * Draws a rectangle
   * @param x x pos
   * @param y y pos
   * @param width width
   * @param height height
   * @param colour Colour
   */
  public drawRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    colour: Colour
  ): void {
    const points: IPoint[] = [];

    points.push({ x, y });
    points.push({ x: x + width, y });
    points.push({ x, y: y + height });
    points.push({ x: x + width, y: y + height });

    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Fills a rectangle
   * @param x x pos
   * @param y y pos
   * @param width width
   * @param height height
   * @param colour Colour
   */
  public fillRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    colour: Colour
  ): void {
    const points: IPoint[] = [];

    points.push({ x, y });
    points.push({ x: x + width, y });
    points.push({ x, y: y + height });
    points.push({ x: x + width, y: y + height });

    this.fillPolygon(new Polygon(points), colour);
  }

  /**
   * Draws a circle
   *
   * @remarks doesnt work
   *
   * @param xc x pos (centre)
   * @param yc y pos (centre)
   * @param radius radius
   * @param samples number of samples
   * @param colour Colour
   */
  public drawCircle(
    xc: number,
    yc: number,
    radius: number,
    samples: number,
    colour: Colour
  ): void {
    const points: IPoint[] = [];
    const step: number = 1 / radius;

    for (let i = 1; i < samples; i++) {
      const x = xc + radius * Math.cos(i * step);
      const y = yc + radius * Math.sin(i * step);

      points.push({ x: x, y: y });
      points.push({ x: x, y: -y });
      points.push({ x: y, y: -x });
      points.push({ x: -y, y: -x });
      points.push({ x: -x, y: -y });
      points.push({ x: -x, y: y });
      points.push({ y: -y, x: x });
      points.push({ x: y, y: x });
    }

    // console.log(points);

    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Fills a circle
   *
   * @remarks doesnt work
   *
   * @param xc x pos (centre)
   * @param yc y pos (centre)
   * @param radius radius
   * @param samples number of samples
   * @param colour Colour
   */
  public fillCircle(
    x: number,
    y: number,
    radius: number,
    samples: number,
    colour: Colour
  ): void {
    const points: IPoint[] = [];

    for (let i = 1; i < samples; i++) {
      const p: IPoint = {
        x: radius * Math.cos((2 * Math.PI) / i),
        y: radius * Math.sin((2 * Math.PI) / i)
      };
      points.push(p);
    }

    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Clears the canvas
   */
  public clear(): void {
    this.ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
  }

  public addTranslations(translationMatrix: any): void {
    // this.translationMatrixs.push(translationMatrix);
  }

  public popTranslation(count: number | undefined): void {
    if (count === undefined) {
      // check this
      count = 1;
    }

    // this.translationMatrixs.pop(count);
  }
}
