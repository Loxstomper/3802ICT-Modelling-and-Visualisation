class Colour {
    r : number;
    g : number;
    b : number;
    a : number;

    constructor(r : number, g : number, b : number, a : number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString() : string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

}

class Rectangle {
    x : number;
    y : number;
    ctx : CanvasRenderingContext2D;
    width : number;
    height : number;
    fill : string;

    constructor(x : number, y : number, ctx : CanvasRenderingContext2D, width : number, height : number, colour : Colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.fill = colour.toString();
    }

    draw() {
        this.ctx.fillStyle = this.fill;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Pixel {
    ctx    : CanvasRenderingContext2D;
    colour : Colour;
    rec    : Rectangle;

    constructor(x : number, y : number, size: number, ctx : CanvasRenderingContext2D, colour : Colour) {
        this.rec = new Rectangle(x, y, ctx, size, size, colour);
        this.rec.draw();
    }
}

const drawLine = (x0, y0, x1, y1, ctx, colour) => {
    const dx = x1 - x0,
          dy = y1 - y0,
          s  = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / this.PIXEL_SIZE,
          xi = dx * 1.0 / s,
          yi = dy * 1.0 / s
 
    let x  = x0,
        y  = y0,
        out= []
 
    out.push({x: x0, y: y0});
 
    for (let i = 0; i < s; i++) {
        x += xi;
        y += yi;
        out.push({x: x, y: y});
    }

    out.map(pos => new Pixel(Math.floor(pos.x), Math.floor(pos.y), this.PIXEL_SIZE, ctx, colour));
}

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const drawPolygon = (points, ctx, colour) => {
    for (let i = 0; i < points.length - 1; i ++) {
        drawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, ctx, colour);
    }

    drawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y, ctx, colour);
}

const drawPolygonFill = (points, ctx, colour) => {
    drawPolygon(points, ctx, colour);

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
            drawLine(Xs[xi], y, Math.round(Xs[xi + 1] - this.PIXEL_SIZE), y, ctx, colour);
        }
    }
}

class Point {
    x : number;
    y : number;

    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

class Polygon {
    points : Point[];
    triangles: Polygon[];

    constructor(points : Point[]) {
        this.points = points;
    }

    decompose() : Polygon[] {
        this.triangles.push(new Polygon([new Point(1, 2)]));
        return this.triangles;
    }
}

class LGE {
    ctx : CanvasRenderingContext2D;
    resolution : any;
    PIXEL_SIZE : number;
    fillMethod : string | null;

    constructor(ctx : CanvasRenderingContext2D, PIXEL_SIZE: number, fillMethod : string | null) {
        this.ctx = ctx;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.fillMethod = fillMethod;

        let canvas : any = ctx.canvas;

        this.resolution = {x : canvas.width, y : canvas.height };

    }

    scalePoints(points: Point[]) : Point[] {

        points.forEach( (p : Point) => {
            p.x = Math.floor(p.x * this.PIXEL_SIZE);
            p.y = Math.floor(p.y * this.PIXEL_SIZE);
        })

        return points;
    }

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

    drawPath(points : Point[], colour : Colour) : void {
        for (let i = 0; i < points.length; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    }

    scanLineFill(poly : Polygon, colour : Colour) : void {

    }

    otherFill(poly : Polygon, colour : Colour) : void {

    }

    fillPolygon(poly : Polygon, colour : Colour) : void {
        if (this.fillMethod === null || this.fillMethod === 'scanLine') {
            this.scanLineFill(poly, colour);
        } else {
            this.otherFill(poly, colour);
        }
    }

    drawPolygon(poly : Polygon, colour : Colour) : void {
        let points = poly.points;

        for (let i = 0; i < points.length - 1; i ++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    
        this.drawLine(points[points.length - 1], points[0], colour);
    }

    drawTriangle(points : Point[], colour : Colour) : void {
        this.drawPolygon(new Polygon(points), colour);
    }

    fillTriangle(points : Point[], colour : Colour) : void {
        this.fillPolygon(new Polygon(points), colour);
    }

    drawRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

        this.drawPolygon(new Polygon(points), colour);
    }

    fillRectangle(x : number, y : number, width : number, height : number, colour : Colour) : void {
        let points : Point[];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));

        this.fillPolygon(new Polygon(points), colour);
    }

    drawCircle(x : number, y : number, radius : number, samples : number, colour : Colour) : void {
        let points : Point[];

        for (let i = 1; i < samples; i ++) {
            let p = new Point(radius * (Math.cos((2 * Math.PI) / i)), 
                              radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }


        this.drawPolygon(new Polygon(points), colour);
    }

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

let colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100)
}

let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
let ctx    : CanvasRenderingContext2D = canvas.getContext("2d");

canvas.width  = 1920;
canvas.height = 1080;

let lge = new LGE(ctx, 8, 'scanLine');

let weird : Polygon = new Polygon([new Point(2, 2), 
                                   new Point(8, 2),
                                   new Point(5, 10)]);
lge.drawPolygon(weird, colours.blue);





