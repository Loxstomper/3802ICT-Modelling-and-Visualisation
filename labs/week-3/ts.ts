
/**
 * Utility Class
 */
class Utils {

    /**
     * Generates a random number [0...max]
     * @param max max number
     * @returns random number between 0 and max
     */
    static randomInt(max : number) : number {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

/**
 *  Represents a colour (r, g, b, a)
 */
class Colour {
    r : number;
    g : number;
    b : number;
    a : number;

    /**
     * 
     * @param r red (0-255)
     * @param g green (0-255)
     * @param b blue (0 - 255)
     * @param a alpha (0 - 100)
     * 
     */
    constructor(r : number, g : number, b : number, a : number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * string representation
     * @returns returns string format 'rgba(r, g, b, a)'
     */
    toString() : string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

}

/**
 * Represents a Rectangle
 */
class Rectangle {
    x : number;
    y : number;
    ctx : CanvasRenderingContext2D;
    width : number;
    height : number;
    fill : string;

    /**
     * 
     * @param x x position 
     * @param y  y position
     * @param ctx canvas context
     * @param width width
     * @param height height
     * @param colour colour
     * 
     */
    constructor(x : number, y : number, ctx : CanvasRenderingContext2D, width : number, height : number, colour : Colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.fill = colour.toString();
    }

    /**
     * draws to the canvas
     */
    draw() {
        this.ctx.fillStyle = this.fill;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

/**
 * Represents a 'pixel'
 */
class Pixel {
    ctx    : CanvasRenderingContext2D;
    colour : Colour;
    rec    : Rectangle;

    /**
     * Draws a pixel on the canvas
     * 
     * @param x x pos
     * @param y y pos
     * @param size size
     * @param ctx canvas context
     * @param colour colour
     * 
     */
    constructor(x : number, y : number, size: number, ctx : CanvasRenderingContext2D, colour : Colour) {
        this.rec = new Rectangle(x, y, ctx, size, size, colour);
        this.rec.draw();
    }
}



/**
 * Represents a point
 */
class Point {
    x : number;
    y : number;

    /**
     * 
     * @param x x pos
     * @param y y pos
     */
    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents a polygon
 */
class Polygon {
    points   : Point[];
    triangles: Polygon[];

    /**
     * 
     * @param points points that represent the polygon
     */
    constructor(points : Point[]) {
        this.points = points;
        this.triangles = [];
    }

    /**
     * decomposes the polygon into triangles
     * @returns an array of polygons
     */
    decompose() : Polygon[] {

        if (this.points.length === 3) {
            // dont want to create a cycle so create new polygon
            this.triangles.push(new Polygon(this.points));
            return this.triangles;
        }

        const nPoints : number = this.points.length;

        for (let i = 0; i < nPoints - 1; i += 2) {
            this.triangles.push(new Polygon([this.points[i], 
                                             this.points[(i + 1) % nPoints], 
                                             this.points[(i + 2) % nPoints]]));
        }


        return this.triangles;
    }

    /**
     * Translate position by deltaX, deltaY
     * @param deltaX change in x
     * @param deltaY change in y
     * 
     * @returns Polygon
     */
    translate(x : number, y : number) : Polygon {
        this.points.forEach((p : Point) => {
            p.x += x;
            p.y += y;
        })

        return this
    }
}

/**
 * Factory to that returns shapes
 */
class ShapeFactory {
    constructor() {

    }

    /**
     * Creates a square polygon
     * 
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * 
     * @returns Polygon
     */
    square(x : number, y : number, width : number, height : number) : Polygon {
        let points : Point[] = [];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x + width, y + height));
        points.push(new Point(x, y + height));

        return new Polygon(points);
    }

    /**
     * Creates a polygon with n points 
     * 
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param nPoints number of points
     * 
     * @returns Polygon
     */
    polygon(x : number, y : number, width : number, height : number, nPoints : number) {
        let points : Point[] = [];

        for (let i = 0; i < nPoints; i ++) {
            points.push(new Point(x + Utils.randomInt(width), y + Utils.randomInt(height)));
        }

        return new Polygon(points);
    }
}

/**
 * Lochie Graphic Engine
 */
class LGE {
    ctx : CanvasRenderingContext2D;
    resolution : any;
    PIXEL_SIZE : number;
    fillMethod : string | null;

    /**
     * 
     * @param ctx canvas ctx
     * @param PIXEL_SIZE size of each pixel
     * @param fillMethod 'scanLine'/null/'other'
     */
    constructor(ctx : CanvasRenderingContext2D, PIXEL_SIZE: number, fillMethod : string | null) {
        this.ctx = ctx;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.fillMethod = fillMethod;

        let canvas : any = ctx.canvas;

        this.resolution = {x : canvas.width, y : canvas.height };

    }

    /**
     * scale points
     * @remarks doesn't actual scale due to issues
     * 
     * @param points points to be scaled
     * @returns Point[]
     */
    scalePoints(points: Point[]) : Point[] {

        return points;

        points.forEach( (p : Point) => {
            p.x = Math.floor(p.x * this.PIXEL_SIZE);
            p.y = Math.floor(p.y * this.PIXEL_SIZE);
        })

        return points;
    }

    /**
     * Draws a coloured line between two points
     * @param start first point
     * @param end end point
     * @param colour Colour
     */
    drawLine(start : Point, end : Point, colour : Colour) : void {
        let p0 : Point;
        let p1 : Point;

        [p0, p1] = this.scalePoints([start, end]);

        const dx = p1.x - p0.x,
              dy = p1.y - p0.y,
              s  = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / this.PIXEL_SIZE,
              xi = dx * 1.0 / s,
              yi = dy * 1.0 / s
     
        let x = p0.x,
            y = p0.y,
            out = []
     
        out.push({x: x, y: y});
     
        for (let i = 0; i < s; i++) {
            x += xi;
            y += yi;
            out.push({x: x, y: y});
        }
    
        out.map(pos => new Pixel(Math.floor(pos.x), Math.floor(pos.y), this.PIXEL_SIZE, this.ctx, colour));
    }

    /**
     * Draws lines between the points
     * @param points Point[]
     * @param colour Colour
     */
    drawPath(points : Point[], colour : Colour) : void {
        for (let i = 0; i < points.length; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    }

    /**
     * Fills a polygon with the given colour
     * @param poly Polygon
     * @param colour Colour
     */
    scanLineFill(poly : Polygon, colour : Colour) : void {

        let points : Point[] = poly.points;

        const minY = points.reduce( (prev, curr) => prev.y < curr.y ? prev : curr).y;
        const maxY = points.reduce( (prev, curr) => prev.y > curr.y ? prev : curr).y;

        let start = points[points.length - 1]
        let edges = []

        for (let i = 0; i < points.length; i ++) {
            edges.push({0: start, 1: points[i]});
            start = points[i];
        }


        for (let y = minY; y < maxY; y += this.PIXEL_SIZE) {
            let Xs = []

            let x, x1, x2, y1, y2, deltaX, deltaY;

            for (let i = 0; i < edges.length; i ++) {
                x1 = edges[i][0].x
                x2 = edges[i][1].x

                y1 = edges[i][0].y
                y2 = edges[i][1].y

                deltaX = x2 - x1;
                deltaY = y2 - y1;

                x = x1 + (deltaX / deltaY) * (y - y1);
                x = Math.round(x);

                if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
                    Xs.push(x);
                }
                
            }

            Xs.sort();

            for (let xi = 0; xi < Xs.length - 1; xi ++) {
                // let left  = Xs[xi]     % 1 == 0 ? Xs[xi] : Math.ceil(Xs[xi]);
                // let right = Xs[xi + 1] % 1 == 0 ? Xs[xi + 1] : Math.floor(Xs[xi + 1]);

                let left  = Xs[xi];
                let right = Xs[xi + 1];

                // console.log("BEFORE: ", left, right);

                // left  = Xs[xi]     % 1 === 0 ? Xs[xi]     : Math.ceil(Xs[xi]);
                // right = Xs[xi + 1] % 1 === 0 ? Xs[xi + 1] : Math.floor(Xs[xi]);

                // console.log("AFTER : ", left, right);

                this.drawLine(new Point(left, y), new Point(right, y), colour);
            }
        }
    }

    /**
     * Other algorithm to fill a polygon
     * @param poly Polygon
     * @param colour Colour
     */
    otherFill(poly : Polygon, colour : Colour) : void {

    }

    /**
     * Fills a polygon based on the method decided on at initialization
     * @param poly Polygon
     * @param colour Colour
     */
    fillPolygon(poly : Polygon, colour : Colour) : void {
        if (this.fillMethod === null || this.fillMethod === 'scanLine') {

            // dont decompose if the polygon is a triangle
            let triangles : Polygon[] = poly.points.length === 3 ? [poly] : poly.decompose();
            

            console.log(triangles);

            // this.scanLineFill(poly, colours.black);


            triangles.forEach((t : Polygon) => {
                this.scanLineFill(t, colour);
                this.drawPolygon(t, colours.red);
            });

            // this.drawPolygon(poly, colours.black);

        } else {
            this.otherFill(poly, colour);
        }
    }

    /**
     * Draws the polygon
     * @param poly Polygon
     * @param colour Colour
     */
    drawPolygon(poly : Polygon, colour : Colour) : void {
        let points = poly.points;


        for (let i = 0; i < points.length - 1; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    
        this.drawLine(points[points.length - 1], points[0], colour);
    }

    /**
     * Draws a triangle from 3 points
     * @param points Points
     * @param colour Colour
     */
    drawTriangle(points : Point[], colour : Colour) : void {
        console.log('sss');
        this.drawPolygon(new Polygon(points), colour);
    }

    /**
     * Fills a triangle from 3 points
     * @param points Point[]
     * @param colour Colour
     */
    fillTriangle(points : Point[], colour : Colour) : void {
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
    drawRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

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
    fillRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

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
    drawCircle(xc : number, yc : number, radius : number, samples : number, colour : Colour) : void {
        let points : Point[] = [];
        let step : number = 1 / radius;

        for (let i = 1; i < samples; i ++) {
            let x = xc + radius * Math.cos(i * step);
            let y = yc + radius * Math.sin(i * step);

            points.push(new Point(x, y));
            points.push(new Point(x, -y));
            points.push(new Point(y, -x));
            points.push(new Point(-y, -x));
            points.push(new Point(-x, -y));
            points.push(new Point(-x, y));
            points.push(new Point(-y, x));
            points.push(new Point(y, x));
        }

        console.log(points);


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
    fillCircle(x : number, y : number, radius : number, samples : number, colour : Colour) : void {
        let points : Point[];

        for (let i = 1; i < samples; i ++) {
            let p = new Point(radius * (Math.cos((2 * Math.PI) / i)), 
                              radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }


        this.drawPolygon(new Polygon(points), colour);
    }

}

// --------------------------- USER CODE -------------------------- //

/**
 * Defining some common colours
 */
let colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100),
    black: new Colour(0, 0, 0, 100),
    white: new Colour(255, 255, 255, 100)
}

/**
 * Get reference to the canvas element and its 2D rendering context
 */
const canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
const ctx    : CanvasRenderingContext2D = canvas.getContext("2d");

/**
 * Set the width here not in the HTML
 */
canvas.width  = 800;
canvas.height = 800;

/**
 * Instantiate the graphics engine - using the scanLine fill method
 */
const lge = new LGE(ctx, 2, 'scanLine');

/**
 * Instantiate Shape Factory
 */
const sf : ShapeFactory = new ShapeFactory();


let points : Point[];

let square : Polygon = sf.square(400, 200, 100, 100);
lge.fillPolygon(square, colours.white);
lge.scanLineFill(square.translate(-110, 0), colours.white);
lge.drawPolygon(square.translate(-110, 0), colours.black);

// lge.drawCircle(300, 300, 50, 4, colours.red);

let triangle : Point[] = [new Point(200, 250), new Point(200, 400), new Point(400, 400)];

lge.fillTriangle(triangle, colours.blue);



let convexPolygon : Polygon = new Polygon([new Point(200, 600),
          new Point(500, 700),
          new Point(500, 750),
          new Point(350, 750)]);

lge.fillPolygon(convexPolygon, colours.black);

let concavePolygon : Polygon = new Polygon([new Point(200, 100),
          new Point(300, 150),
          new Point(400, 100),
          new Point(400, 200),
          new Point(200, 200)]);

lge.fillPolygon(concavePolygon, colours.green);
lge.drawPolygon(concavePolygon, colours.black);

let octogon : Polygon = new Polygon([new Point(600, 50),
                                     new Point(650, 50),
                                     new Point(675, 75),
                                     new Point(675, 100),
                                     new Point(650, 125),
                                     new Point(600, 125),
                                     new Point(575, 100),
                                     new Point(575, 75)
                                    ]);

lge.fillPolygon(octogon, colours.green);
lge.drawPolygon(octogon.translate(-150, 0), colours.blue);


let boundingBox = sf.square(400, 400, 400, 250);
const randomDraw = () => {
    // lge.fillPolygon(boundingBox, colours.white);

    let randomPolygon : Polygon = sf.polygon(400, 400, 400, 250, 5);
    lge.fillPolygon(randomPolygon, colours.green);
    lge.drawPolygon(randomPolygon, colours.black);


    // setTimeout(randomDraw, 100);
}

randomDraw();





