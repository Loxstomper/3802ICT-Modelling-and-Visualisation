import { Colour, Colours } from "./Colour";
import { IPoint } from "./IPoint";
import { Matrix } from "./Matrix";
import { Pixel } from "./Pixel";
import { Polygon } from "./Polygon";

/**
 * # Lochie's Graphics Engine
 *
 * A 2D graphics engine which uses the HTML5 canvas.
 *
 * ## Components
 * Lochie's Graphics Engine (LGE) is comprised of multiple components this is the main class which handles rendering.
 *
 * See [IPoint](../interfaces/_ipoint_.ipoint.html),
 * [Polygon](_polygon_.polygon.html)
 * [Rectangle](_rectangle_.rectangle.html),
 * [Pixel](_pixel_.pixel.html),
 * [Utils](_utils_.utils.html),
 * [ShapeFactory](_shapefactory_.shapefactory.html),
 * [Colour](_colour_.colour.html) for more details.
 *
 * ## Coordinate Spaces
 * The origin (0, 0) is the top left of the canvas, when drawing coordinates are taken as is - there is no manipulation.
 * The resolution is determined from the canvas in the constructor.
 *
 * ## Pixel size
 * The pixel size determines the size of each pixel but does not modify the coordinate system.
 *
 * ## Rendering process
 * LGE primarily deals with polygons [drawPolygon(poly: Polygon, colour?: Colour)](#drawpolygon) will be used as an
 * example.
 *
 * 1. the points are extracted from the polygon
 * 2. if the polygon has a fill colour the scan line fill algorithm is used to draw and fill the polygon
 * 3. if a colour was provided when calling the function that will be the outline colour else the polygon's colour
 *    will be used
 * 4. the outline of the polygon is drawn using the DDA algorithm
 *
 * The polygon will now stay on the canvas until the canvas has been cleared.
 *
 * ### Rendering example
 * The following simple example will render two squares on the canvas and rotate them.
 * The [drawPolygonBuffer(buffer: Polygon[]](#drawpolygonbuffer) function is used which iterates over the buffer and
 * calls [drawPolygon(poly: Polygon, colour?: Colour)](#drawpolygon)
 *
 * <br> Assuming: </b> ctx variable is the CanvasRenderingContext2D
 *
 * ```js
 *
 * // instantiate LGE
 * const lge: LGE = new LGE(ctx, 1, 'scanLine')
 *
 * // degrees / second
 * const rotationSpeed = 360;
 *
 * // polygons
 * const square1: Polygon = sf.square(100, 100, 100, 100);
 * const square2: Polygon = sf.square(400, 400, 100, 100);
 *
 * // frame rendering time deltas
 * let frameTimeDelta = 0;
 * let lastFrameTime = 0;
 *
 *
 * // the draw function
 * const draw = (timestamp: number) => {
 *
 *    // clear the canvas
 *    lge.clear();
 *
 *    // calculate time delta
 *    frameTimeDelta = (timestamp - lastFrameTime) / 1000;
 *    lastFrameTime = timestamp;
 *
 *    // rotate the squares accurately (taking previous frame render time into account)
 *    square1.rotate(rotationSpeed * frameTimeDelta);
 *    square2.rotate(rotationSpeed * frameTimeDelta);
 *
 *    // create the buffer of polygons to draw
 *    const polygonBuffer: Polygon[] = [square1, square2];
 *
 *    // draw every polygon in the buffer
 *    lge.drawPolygonBuffer(polygonBuffer);
 *
 *    // call this function on the next animation frame
 *    requestAnimationFrame(draw);
 * }
 *
 * // start the draw loop
 * requestAnimationFrame(draw);
 *
 * ```
 *
 */
export class LGE {
  public resolution: IPoint;
  private PIXEL_SIZE: number;
  private fillMethod: string | null;
  private translationMatrix: Matrix;
  private rotationMatrix: Matrix;
  private transformationMatrices: Matrix[] = [];
  private ctx: CanvasRenderingContext2D;

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
  }

  /**
   * combines the translation matrix and rotation matrix into a single matrix and adds to stack
   */
  public updateTransformationMatrix(): Matrix {
    const r: Matrix = this.rotationMatrix;
    const t: Matrix = this.translationMatrix;

    const values: number[][] = [
      [r.values[0][0], r.values[0][1], t.values[0][0]],
      [r.values[1][0], r.values[1][1], t.values[1][0]],
      [0, 0, 1]
    ];

    const res: Matrix = new Matrix(values);
    this.transformationMatrices.push(res);

    return res;
  }

  /**
   * updates rotation matrix and applies to transformation matrix
   *
   * @param angle radians
   */
  public setRotation(angle: number): void {
    const cosTheta: number = Math.cos(angle);
    const sinTheta: number = Math.sin(angle);

    this.rotationMatrix.values = [[cosTheta, -sinTheta], [sinTheta, cosTheta]];

    this.updateTransformationMatrix();
  }

  /**
   * sets translation matrix values and updates the transformation matrix
   *
   * @param dX change in x
   * @param dY change in y
   */
  public setTranslation(dX: number, dY: number): void {
    this.translationMatrix.values = [[dX], [dY]];

    this.updateTransformationMatrix();
  }

  /**
   * Draws a coloured line between two IPoints using the DDA algorithm where each pixel is the size of PIXEL_SIZE
   *
   * @param start first IPoint
   * @param end end IPoint
   * @param colour Colour
   */
  public drawLine(start: IPoint, end: IPoint, colour: Colour): void {
    const p0: IPoint = start;
    const p1: IPoint = end;

    const dx: number = Math.ceil(p1.x - p0.x);
    const dy: number = Math.ceil(p1.y - p0.y);

    const steps: number =
      Math.abs(dx) > Math.abs(dy)
        ? Math.ceil(Math.abs(dx) / this.PIXEL_SIZE)
        : Math.ceil(Math.abs(dy) / this.PIXEL_SIZE);

    if (steps === 0) {
      // tslint:disable-next-line: no-unused-expression
      new Pixel(p0.x, p0.y, this.PIXEL_SIZE, this.ctx, colour);
      return;
    }

    const xInc: number = dx / steps;
    const yInc: number = dy / steps;

    let x: number = p0.x;
    let y: number = p0.y;

    for (let i = 0; i < steps; i++) {
      // tslint:disable-next-line: no-unused-expression
      new Pixel(x, y, this.PIXEL_SIZE, this.ctx, colour);
      x += xInc;
      y += yInc;
    }
  }

  /**
   * Draws a path between a series of IPoints using drawLine();
   *
   * @param points IPoint[]
   * @param colour Colour
   */
  public drawPath(points: IPoint[], colour: Colour): void {
    for (let i = 0; i < points.length; i++) {
      this.drawLine(points[i], points[i + 1], colour);
    }
  }

  /**
   * Fills a Polygon using the scanLineFill algorithm with the colour provided
   *
   * @param poly Polygon
   * @param colour Colour
   */
  public scanLineFill(poly: Polygon, colour: Colour): void {
    const points: IPoint[] = poly.points;

    const minY: number = points.reduce((prev, curr) =>
      prev.y < curr.y ? prev : curr
    ).y;

    const maxY: number = points.reduce((prev, curr) =>
      prev.y > curr.y ? prev : curr
    ).y;

    let start: IPoint = points[points.length - 1];

    const edges: any[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i: number = 0; i < points.length; i++) {
      edges.push({ 0: start, 1: points[i] });
      start = points[i];
    }

    for (let y: number = minY; y < maxY; y += this.PIXEL_SIZE) {
      const Xs: number[] = [];

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

      for (let xi: number = 0; xi < Xs.length - 1; xi += 2) {
        const left: number = Xs[xi];
        const right: number = Xs[xi + 1];

        this.drawLine({ x: left, y }, { x: right, y }, colour);
      }
    }
  }

  /**
   * Fills a polygon based on the method decided on at initialization
   *
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
   * Fills the polygon using the Polygons fill colour and draws the outline with colour or the Polygons colour
   *
   * @param poly Polygon
   * @param colour Optional Colour - overwrites polygon colour
   */
  public drawPolygon(poly: Polygon, colour?: Colour): void {
    const points: IPoint[] = poly.points;

    if (poly.fillColour) {
      this.scanLineFill(poly, poly.fillColour);
    }

    const outlineColour: Colour = colour ? colour : poly.colour;

    for (let i: number = 0; i < points.length - 1; i++) {
      this.drawLine(points[i], points[i + 1], outlineColour);
    }

    this.drawLine(points[points.length - 1], points[0], outlineColour);
  }

  /**
   * Draws an array of Polygons using drawPolygon()
   *
   * @param buffer Polygon[]
   */
  public drawPolygonBuffer(buffer: Polygon[]): void {
    buffer.forEach((p: Polygon) => {
      this.drawPolygon(p);
    });
  }

  /**
   * Draws a triangle from 3 points
   *
   * @param points Points
   * @param colour Colour
   */
  public drawTriangle(points: IPoint[], colour: Colour): void {
    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Fills a triangle from 3 points
   *
   * @param points IPoint[]
   * @param colour Colour
   */
  public fillTriangle(points: IPoint[], colour: Colour): void {
    this.fillPolygon(new Polygon(points), colour);
  }

  /**
   * Draws a rectangle
   *
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
   *
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

    for (let i: number = 1; i < samples; i++) {
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

    for (let i: number = 1; i < samples; i++) {
      const p: IPoint = {
        x: radius * Math.cos((2 * Math.PI) / i),
        y: radius * Math.sin((2 * Math.PI) / i)
      };
      points.push(p);
    }

    this.drawPolygon(new Polygon(points), colour);
  }

  /**
   * Clears the whole canvas
   */
  public clear(): void {
    this.ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
  }

  /**
   * Clears the canvas by clearing the polygon's bounding boxes
   *
   * @param polygons polygons to be cleared
   */
  public clearSmart(polygons: Polygon[]): void {
    // going to clear each bounding box
    polygons.forEach(p => {
      const bb = p.boundingBox.points;
      const x = bb[0].x;
      const y = bb[0].y;
      const width = bb[1].x - x;
      const height = bb[2].y - y;

      this.ctx.clearRect(
        x - 10 * this.PIXEL_SIZE,
        y - 10 * this.PIXEL_SIZE,
        width + 10 * this.PIXEL_SIZE,
        height + 10 * this.PIXEL_SIZE
      );
    });

    // clear the score and fps value
    this.ctx.clearRect(0, 0, 200, 200);
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
