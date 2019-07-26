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
        this.triangles = [];
    }

    decompose() : Polygon[] {
        // for (let i = 0; i < this.points.length - 3; i += 3) {
        //     this.triangles.push(new Polygon([this.points[i], this.points[i + 1], this.points[i + 2]]));
        // }

        // this.triangles.push(new Polygon([this.points[this.points.length - 1], this.points[this.points.length], this.points[0]]));

        for (let i = 1; i < this.points.length - 2; i ++) {
            this.triangles.push(new Polygon([this.points[i - 1], this.points[i], this.points[i + 1]]));
        }

        // this.triangles.push(new Polygon([this.points[this.points.length - 1], this.points[this.points.length], this.points[0]]));

        return this.triangles;
    }
}

class ShapeFactory {
    constructor() {

    }

    square(x : number, y : number, width : number, height : number) : Polygon {
        let points : Point[] = [];

        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x + width, y + height));
        points.push(new Point(x, y + height));

        return new Polygon(points);
    }

    polygon(x : number, y : number, width : number, height : number, nPoints : number) {
        let points : Point[] = [];

        for (let i = 0; i < nPoints; i ++) {
            points.push(new Point(x + randomInt(width), y + randomInt(height)));
        }

        return new Polygon(points);
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

        return points;

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

        this.drawPolygon(poly, colour);

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
                // let right = Xs[xi + 1] % 1 == 0 ? Xs[xi] : Math.floor(Xs[xi]);

                let left  = Xs[xi];
                let right = Xs[xi + 1];

                console.log(left, right);

                // this.drawLine(new Point(Xs[xi], y), new Point(Math.round(Xs[xi + 1]), y), colour);
                this.drawLine(new Point(left, y), new Point(right, y), colour);
            }
        }
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
    blue : new Colour(0, 0, 255, 100),
    black: new Colour(0, 0, 0, 100),
    white: new Colour(255, 255, 255, 100)
}

let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
let ctx    : CanvasRenderingContext2D = canvas.getContext("2d");

canvas.width  = 800;
canvas.height = 800;

let lge = new LGE(ctx, 4, 'scanLine');

// let weird : Polygon = new Polygon([new Point(2, 2), 
//                                    new Point(8, 2),
//                                    new Point(5, 10),
//                                    new Point(2, 2)]);

let points : any =  [new Point(2, 2), new Point(200, 300), new Point(350, 2)];


lge.drawPolygon(new Polygon(points), colours.blue);
lge.fillPolygon(new Polygon(points), colours.blue);

points =  [new Point(100, 200), 
           new Point(200, 300), 
           new Point(300, 200),
           new Point(300, 400),
           new Point(200, 310),
           new Point(100, 400)];

lge.fillPolygon(new Polygon(points), colours.green);
lge.drawPolygon(new Polygon(points), colours.black);

let sf : ShapeFactory = new ShapeFactory();

let square : Polygon = sf.square(350, 200, 100, 100);

lge.drawPolygon(square, colours.white);

let tris : Polygon[] = square.decompose();

for (let i = 0; i < tris.length; i ++) {
    lge.drawPolygon(tris[i], colours.black);
}

lge.drawPolygon(sf.polygon(100, 100, 200, 200, 6), colours.black);

lge.drawCircle(300, 300, 50, 4, colours.red);




// lge.drawPolygon(weird, colours.blue);
// console.log(points);
// lge.drawLine(points[0], points[1], colours.red);
// console.log(points);
// lge.drawLine(points[1], points[2], colours.red);
// console.log(points);
// lge.drawLine(points[2], points[0], colours.red);
// console.log(points);consoconsole.log(points);console.log(points);le.log(points);





