var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
// c.width = window.innerWidth * 0.9;
// c.height = window.innerHeight * 0.9;
c.width = 400;
c.height = 400;
var width = c.width;
var height = c.height;

// resizeCanvas();

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
    constructor(x, y, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.fill = `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
    }

    draw() {
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        // ctx.stroke();
    }
}

class Pixel {
    constructor(x, y, colour) {
        let width  = pixelSize;
        let height = pixelSize;

        this.rec = new Rectangle(x, y, width, height, colour);
        this.rec.draw();
    }
}

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    c.width = window.innerWidth * 0.9;
    c.height = window.innerHeight * 0.9;
    width = c.width;
    height = c.height;
}

const drawLine = (x0, y0, x1, y1, colour) => {
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

    out.map(pos => new Pixel(pos.x, pos.y, colour));
}


// function updateAll() {
//     ctx.clearRect(0, 0, width, height);
//     for (let i = 0; i < rectangles.length; i ++) {
//         rectangles[i].draw();
//     }

//     requestAnimationFrame(updateAll);
// }

// updateAll();

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

let colours = {
    red  : new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue : new Colour(0, 0, 255, 100)
}

// for (let i = 0; i < 10; i ++) {
//     drawLine(randomInt(width), randomInt(height), randomInt(width), randomInt(height), colours.red);
// }

    // drawLine(randomInt(width), randomInt(height), randomInt(width), randomInt(height), colours.red);

class PixelLab {
    constructor() {
        new Pixel(10, 10, colours.red);
        new Pixel(18, 18, colours.green);
        new Pixel(26, 26, colours.blue);
    }

}

new PixelLab();