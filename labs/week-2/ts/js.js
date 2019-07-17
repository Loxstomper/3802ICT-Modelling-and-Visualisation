var pixelSize = 8;

class Colour {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class Rectangle {
    constructor(x, y, ctx, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.fill = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
    }

    draw() {
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.fill;
        this.ctx.fill();
    }
}

class Pixel {
    constructor(x, y, ctx, colour) {
        let width  = pixelSize;
        let height = pixelSize;

        this.rec = new Rectangle(x, y, ctx, width, height, colour);
        this.rec.draw();
    }
}

const drawLine = (x0, y0, x1, y1, ctx, colour) => {
    const dx = x1 - x0,
          dy = y1 - y0,
          s  = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / pixelSize,
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

    out.map(pos => new Pixel(Math.round(pos.x), Math.round(pos.y), ctx, colour));
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


class PixelLab {
    constructor(ctx) {
        new Pixel(10, 10, ctx, colours.red);
        new Pixel(18, 18, ctx, colours.green);
        new Pixel(26, 26, ctx, colours.blue);
    }
}

class Point {
    constructor(x, y) {
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
        drawLine(18, 18, 92, 92, ctx, colours.red);
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

        for (let i = 0; i < 3; i ++) {
            let point = new Point(randomInt(width / 4), randomInt(height / 4));
            points.push(point);
        }

        drawPolygon(points, ctx, colours.blue);

        points = [];

        for (let i = 0; i < 6; i ++) {
            let point = new Point(randomInt(100 + width / 2), randomInt(100 + height / 2));
            points.push(point);
        }

        drawPolygon(points, ctx, colours.green);
    }
}

let colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100)
}

let pixelCanvas = document.getElementById("pixelCanvas");
let pixelCtx = pixelCanvas.getContext("2d");
pixelCanvas.width  = 50;
pixelCanvas.height = 50;

new PixelLab(pixelCtx);

let randomPixelCanvas = document.getElementById("randomPixelCanvas");
let randomPixelCtx = randomPixelCanvas.getContext("2d");

randomPixelCanvas.width  = 400;
randomPixelCanvas.height = 400;

new RandomPixelLab(randomPixelCanvas.width, randomPixelCanvas.height, randomPixelCtx);

let lineCanvas = document.getElementById("lineCanvas");
let lineCanvasCtx = lineCanvas.getContext("2d");

lineCanvas.width  = 150;
lineCanvas.height = 150;

new LineLab(lineCanvasCtx);

let randomLinesCanvas = document.getElementById("randomLinesCanvas");
let randomLinesCtx = randomLinesCanvas.getContext("2d");

randomLinesCanvas.width  = 400;
randomLinesCanvas.height = 400;

new RandomLineLab(randomLinesCanvas.x, randomLinesCanvas.y, randomLinesCtx);

let polygonCanvas = document.getElementById("polygonCanvas");
let polygonCtx = polygonCanvas.getContext("2d");

polygonCanvas.width  = 400;
polygonCanvas.height = 400;

new PolygonLab(polygonCanvas.width, polygonCanvas.height, polygonCtx);
