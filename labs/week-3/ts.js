var _this = this;
var Colour = /** @class */ (function () {
    function Colour(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Colour.prototype.toString = function () {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };
    return Colour;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, ctx, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.fill = colour.toString();
    }
    Rectangle.prototype.draw = function () {
        this.ctx.fillStyle = this.fill;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}());
var Pixel = /** @class */ (function () {
    function Pixel(x, y, size, ctx, colour) {
        this.rec = new Rectangle(x, y, ctx, size, size, colour);
        this.rec.draw();
    }
    return Pixel;
}());
var drawLine = function (x0, y0, x1, y1, ctx, colour) {
    var dx = x1 - x0, dy = y1 - y0, s = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / _this.PIXEL_SIZE, xi = dx * 1.0 / s, yi = dy * 1.0 / s;
    var x = x0, y = y0, out = [];
    out.push({ x: x0, y: y0 });
    for (var i = 0; i < s; i++) {
        x += xi;
        y += yi;
        out.push({ x: x, y: y });
    }
    out.map(function (pos) { return new Pixel(Math.floor(pos.x), Math.floor(pos.y), _this.PIXEL_SIZE, ctx, colour); });
};
var randomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};
var drawPolygon = function (points, ctx, colour) {
    for (var i = 0; i < points.length - 1; i++) {
        drawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, ctx, colour);
    }
    drawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y, ctx, colour);
};
var drawPolygonFill = function (points, ctx, colour) {
    drawPolygon(points, ctx, colour);
    var minY = points.reduce(function (prev, curr) { return prev.y < curr.y ? prev : curr; }).y;
    var maxY = points.reduce(function (prev, curr) { return prev.y > curr.y ? prev : curr; }).y;
    var start = points[points.length - 1];
    var edges = [];
    for (var i = 0; i < points.length; i++) {
        edges.push({ 0: start, 1: points[i] });
        start = points[i];
    }
    for (var y = minY; y < maxY; y += _this.PIXEL_SIZE) {
        var Xs = [];
        var x = void 0, x1 = void 0, x2 = void 0, y1 = void 0, y2 = void 0, deltaX = void 0, deltaY = void 0;
        for (var i = 0; i < edges.length; i++) {
            x1 = edges[i][0].x;
            x2 = edges[i][1].x;
            y1 = edges[i][0].y;
            y2 = edges[i][1].y;
            deltaX = x2 - x1;
            deltaY = y2 - y1;
            x = x1 + (deltaX / deltaY) * (y - y1);
            x = Math.round(x);
            if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
                Xs.push(x);
            }
        }
        Xs.sort();
        for (var xi = 0; xi < Xs.length - 1; xi++) {
            drawLine(Xs[xi], y, Math.round(Xs[xi + 1] - _this.PIXEL_SIZE), y, ctx, colour);
        }
    }
};
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Polygon = /** @class */ (function () {
    function Polygon(points) {
        this.points = points;
    }
    Polygon.prototype.decompose = function () {
        this.triangles.push(new Polygon([new Point(1, 2)]));
        return this.triangles;
    };
    return Polygon;
}());
var LGE = /** @class */ (function () {
    function LGE(ctx, PIXEL_SIZE, fillMethod) {
        this.ctx = ctx;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.fillMethod = fillMethod;
        var canvas = ctx.canvas;
        this.resolution = { x: canvas.width, y: canvas.height };
    }
    LGE.prototype.scalePoints = function (points) {
        var _this = this;
        points.forEach(function (p) {
            p.x = Math.floor(p.x * _this.PIXEL_SIZE);
            p.y = Math.floor(p.y * _this.PIXEL_SIZE);
        });
        return points;
    };
    LGE.prototype.drawLine = function (start, end, colour) {
        var _this = this;
        var _a;
        var p0;
        var p1;
        _a = this.scalePoints([start, end]), p0 = _a[0], p1 = _a[1];
        var dx = p1.x - p0.x, dy = p1.y - p0.y, s = (Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)) / this.PIXEL_SIZE, xi = dx * 1.0 / s, yi = dy * 1.0 / s;
        var x = p0.x, y = p0.y, out = [];
        out.push({ x: x, y: y });
        for (var i = 0; i < s; i++) {
            x += xi;
            y += yi;
            out.push({ x: x, y: y });
        }
        out.map(function (pos) { return new Pixel(Math.floor(pos.x), Math.floor(pos.y), _this.PIXEL_SIZE, _this.ctx, colour); });
    };
    LGE.prototype.drawPath = function (points, colour) {
        for (var i = 0; i < points.length; i++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    };
    LGE.prototype.scanLineFill = function (poly, colour) {
    };
    LGE.prototype.otherFill = function (poly, colour) {
    };
    LGE.prototype.fillPolygon = function (poly, colour) {
        if (this.fillMethod === null || this.fillMethod === 'scanLine') {
            this.scanLineFill(poly, colour);
        }
        else {
            this.otherFill(poly, colour);
        }
    };
    LGE.prototype.drawPolygon = function (poly, colour) {
        var points = poly.points;
        for (var i = 0; i < points.length - 1; i++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
        this.drawLine(points[points.length - 1], points[0], colour);
    };
    LGE.prototype.drawTriangle = function (points, colour) {
        this.drawPolygon(new Polygon(points), colour);
    };
    LGE.prototype.fillTriangle = function (points, colour) {
        this.fillPolygon(new Polygon(points), colour);
    };
    LGE.prototype.drawRectangle = function (x, y, width, height, colour) {
        var points;
        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));
        this.drawPolygon(new Polygon(points), colour);
    };
    LGE.prototype.fillRectangle = function (x, y, width, height, colour) {
        var points;
        points.push(new Point(x, y));
        points.push(new Point(x + width, y));
        points.push(new Point(x, y + height));
        points.push(new Point(x + width, y + height));
        this.fillPolygon(new Polygon(points), colour);
    };
    LGE.prototype.drawCircle = function (x, y, radius, samples, colour) {
        var points;
        for (var i = 1; i < samples; i++) {
            var p = new Point(radius * (Math.cos((2 * Math.PI) / i)), radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }
        this.drawPolygon(new Polygon(points), colour);
    };
    LGE.prototype.fillCircle = function (x, y, radius, samples, colour) {
        var points;
        for (var i = 1; i < samples; i++) {
            var p = new Point(radius * (Math.cos((2 * Math.PI) / i)), radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }
        this.drawPolygon(new Polygon(points), colour);
    };
    return LGE;
}());
var colours = {
    red: new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue: new Colour(0, 0, 255, 100)
};
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1920;
canvas.height = 1080;
var lge = new LGE(ctx, 8, 'scanLine');
var weird = new Polygon([new Point(2, 2),
    new Point(8, 2),
    new Point(5, 10)]);
lge.drawPolygon(weird, colours.blue);
