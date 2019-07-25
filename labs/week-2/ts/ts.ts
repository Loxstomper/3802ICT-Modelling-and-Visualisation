var PIXEL_SIZE = 6;

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
    ctx : CanvasRenderingContext2D;
    colour : Colour;
    rec : Rectangle;

    constructor(x : number, y : number, ctx : CanvasRenderingContext2D, colour : Colour) {
        let width  = PIXEL_SIZE;
        let height = PIXEL_SIZE;

        this.rec = new Rectangle(x, y, ctx, width, height, colour);
        this.rec.draw();
    }
}

const drawLine = (x0, y0, x1, y1, ctx, colour) => {
    const dx = x1 - x0,
          dy = y1 - y0,
          s  = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / PIXEL_SIZE,
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

    out.map(pos => new Pixel(Math.floor(pos.x), Math.floor(pos.y), ctx, colour));
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


    for (let y = minY; y < maxY; y += PIXEL_SIZE) {
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
            drawLine(Xs[xi], y, Math.round(Xs[xi + 1] - PIXEL_SIZE), y, ctx, colour);
        }
    }
}


class PixelLab {
    constructor(ctx : CanvasRenderingContext2D) {
        new Pixel(10, 10, ctx, colours.red);
        new Pixel(18, 18, ctx, colours.green);
        new Pixel(26, 26, ctx, colours.blue);
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

class RandomPixelLab {
    constructor(width, height, ctx) {
        for (let i = 0; i < 100; i ++) {
            new Pixel(randomInt(width), randomInt(height), ctx, new Colour(randomInt(255), randomInt(255), randomInt(255), 100));
        }
    }
}

class LineLab {
    constructor(ctx) {
        drawLine(10, 10, 100, 10, ctx, colours.red);
        drawLine(10, 10, 10, 100, ctx, colours.red);
        drawLine(18, 18, 92, 92,  ctx, colours.red);
        drawLine(26, 40, 60, 100, ctx, colours.red);
    }
}

class RandomLineLab {
    constructor(width, height, ctx) {
        for (let i = 0; i < 10; i ++) {
            drawLine(randomInt(width), randomInt(height), randomInt(width), randomInt(height), ctx, new Colour(randomInt(255), randomInt(255), randomInt(255), 100));
        }
    }        
}

class PolygonLab {
    constructor(width, height, ctx) {

        let points = []

        // triangle
        points.push(new Point(40, 10));
        points.push(new Point(80, 100));
        points.push(new Point(120, 10));

        drawPolygon(points, ctx, colours.blue);

        points = [];

        // triangle - fill
        points.push(new Point(40, 260));
        points.push(new Point(80, 370));
        points.push(new Point(120, 260));

        drawPolygonFill(points, ctx, colours.blue);

        points = [];

        for (let i = 0; i < 5; i ++) {
            // let point = new Point((width / 2) + randomInt(width / 2 - 10), randomInt(height / 2 - 10));
            let x = 250 + (20 * Math.cos((i*(10 + randomInt(300) / 180))) * Math.PI);
            let y = 80 + (20 * Math.sin((i*(10 + randomInt(300)) / 180)) * Math.PI);
            let point = new Point(x, y);
            points.push(point);
        }

        drawPolygon(points, ctx, colours.green);

        points = points.map(p => new Point(p.x, p.y + 200));

        drawPolygonFill(points, ctx, colours.green);
    }
}

let colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100)
}

let pixelCanvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("pixelCanvas");
let pixelCtx : CanvasRenderingContext2D = pixelCanvas.getContext("2d");
pixelCanvas.width  = 50;
pixelCanvas.height = 50;

new PixelLab(pixelCtx);

let randomPixelCanvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("randomPixelCanvas");
let randomPixelCtx : CanvasRenderingContext2D = randomPixelCanvas.getContext("2d");

randomPixelCanvas.width  = 400;
randomPixelCanvas.height = 400;

new RandomPixelLab(randomPixelCanvas.width, randomPixelCanvas.height, randomPixelCtx);

let lineCanvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("lineCanvas");
let lineCanvasCtx : CanvasRenderingContext2D = lineCanvas.getContext("2d");

lineCanvas.width  = 150;
lineCanvas.height = 150;

new LineLab(lineCanvasCtx);

let randomLinesCanvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("randomLinesCanvas");
let randomLinesCtx : CanvasRenderingContext2D = randomLinesCanvas.getContext("2d");

randomLinesCanvas.width  = 400;
randomLinesCanvas.height = 400;

new RandomLineLab(randomLinesCanvas.width, randomLinesCanvas.height, randomLinesCtx);

let polygonCanvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("polygonCanvas");
let polygonCtx : CanvasRenderingContext2D = polygonCanvas.getContext("2d");

polygonCanvas.width  = 400;
polygonCanvas.height = 400;

const testing = () => { 
    polygonCtx.clearRect(0, 0, polygonCanvas.width, polygonCanvas.height);
    new PolygonLab(polygonCanvas.width, polygonCanvas.height, polygonCtx);
    // setTimeout(testing, 1000);
}

testing();