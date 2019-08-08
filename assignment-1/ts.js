(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 *  Represents a colour (r, g, b, a)
 */
var Colour = /** @class */ (function () {
    /**
     *
     * @param r red (0-255)
     * @param g green (0-255)
     * @param b blue (0 - 255)
     * @param a alpha (0 - 100)
     *
     */
    function Colour(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
     * string representation
     * @returns returns string format 'rgba(r, g, b, a)'
     */
    Colour.prototype.toString = function () {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };
    return Colour;
}());
exports.Colour = Colour;
exports.Colours = {
    red: new Colour(255, 0, 0, 100),
    green: new Colour(0, 255, 0, 100),
    blue: new Colour(0, 0, 255, 100),
    black: new Colour(0, 0, 0, 100),
    white: new Colour(255, 255, 255, 100)
};

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Point_1 = require("./Point");
var Colour_1 = require("./Colour");
var Polygon_1 = require("./Polygon");
var Pixel_1 = require("./Pixel");
var Matrix_1 = require("./Matrix");
/**
 * Lochie Graphics Engine
 */
var LGE = /** @class */ (function () {
    /**
     *
     * @param ctx canvas ctx
     * @param PIXEL_SIZE size of each pixel
     * @param fillMethod 'scanLine'/null/'other'
     */
    function LGE(ctx, PIXEL_SIZE, fillMethod) {
        this.transformationMatrices = [];
        this.ctx = ctx;
        this.PIXEL_SIZE = PIXEL_SIZE;
        this.fillMethod = fillMethod;
        var canvas = ctx.canvas;
        this.resolution = { x: canvas.width, y: canvas.height };
        this.translationMatrix = new Matrix_1.Matrix([[0], [0]]);
        this.rotationMatrix = new Matrix_1.Matrix([[1, 0], [0, 1]]);
        this.updateTransformationMatrix();
        console.log('Transformation matrices: ');
        console.log(this.transformationMatrices);
    }
    /**
     * combines the translation matrix and rotation matrix into a single one and adds to stack
     */
    LGE.prototype.updateTransformationMatrix = function () {
        var r = this.rotationMatrix;
        var t = this.translationMatrix;
        var values = [
            [r.values[0][0], r.values[0][1], t.values[0][0]],
            [r.values[1][0], r.values[1][1], t.values[1][0]],
            [0, 0, 1],
        ];
        var res = new Matrix_1.Matrix(values);
        this.transformationMatrices.push(res);
        console.log('translation matrix');
        console.log(t);
        console.log('rotation matrix');
        console.log(r);
        console.log('Transformation Matrix');
        console.log(res);
        return res;
    };
    LGE.prototype.setRotation = function (angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        this.rotationMatrix.values = [
            [cosTheta, -sinTheta],
            [sinTheta, cosTheta]
        ];
        this.updateTransformationMatrix();
    };
    LGE.prototype.setTranslation = function (dX, dY) {
        this.translationMatrix.values = [
            [dX],
            [dY]
        ];
        this.updateTransformationMatrix();
    };
    /**
     * scale points
     * @remarks doesn't actual scale due to issues
     *
     * @param points points to be scaled
     * @returns Point[]
     */
    LGE.prototype.scalePoints = function (points) {
        return points;
        // points.forEach( (p : Point) => {
        //     p.x = Math.floor(p.x) * this.PIXEL_SIZE;
        //     p.y = Math.floor(p.y) * this.PIXEL_SIZE;
        // })
        // return points;
    };
    /**
     * Draws a coloured line between two points
     * @param start first point
     * @param end end point
     * @param colour Colour
     */
    LGE.prototype.drawLine = function (start, end, colour) {
        var _a;
        var p0;
        var p1;
        _a = this.scalePoints([start, end]), p0 = _a[0], p1 = _a[1];
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
        var dx = Math.ceil(p1.x - p0.x), dy = Math.ceil(p1.y - p0.y), steps = Math.abs(dx) > Math.abs(dy) ? Math.ceil(Math.abs(dx) / this.PIXEL_SIZE)
            : Math.ceil(Math.abs(dy) / this.PIXEL_SIZE);
        if (steps === 0) {
            new Pixel_1.Pixel(p0.x, p0.y, this.PIXEL_SIZE, this.ctx, colour);
            return;
        }
        var xInc = dx / steps;
        var yInc = dy / steps;
        var x = p0.x;
        var y = p0.y;
        for (var i = 0; i < steps; i++) {
            new Pixel_1.Pixel(x, y, this.PIXEL_SIZE, this.ctx, colour);
            x += xInc;
            y += yInc;
        }
    };
    /**
     * Draws lines between the points
     * @param points Point[]
     * @param colour Colour
     */
    LGE.prototype.drawPath = function (points, colour) {
        for (var i = 0; i < points.length; i++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    };
    /**
     * Fills a polygon with the given colour
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.scanLineFill = function (poly, colour) {
        var points = poly.points;
        var minY = points.reduce(function (prev, curr) { return prev.y < curr.y ? prev : curr; }).y;
        var maxY = points.reduce(function (prev, curr) { return prev.y > curr.y ? prev : curr; }).y;
        var start = points[points.length - 1];
        var edges = [];
        for (var i = 0; i < points.length; i++) {
            edges.push({ 0: start, 1: points[i] });
            start = points[i];
        }
        for (var y = minY; y < maxY; y += this.PIXEL_SIZE) {
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
                // x = Math.round(x1 * deltaX / deltaY * (y - y1));
                if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
                    Xs.push(x);
                }
            }
            Xs.sort();
            for (var xi = 0; xi < Xs.length - 1; xi += 2) {
                // let left  = Xs[xi]     % 1 == 0 ? Xs[xi] : Math.ceil(Xs[xi]);
                // let right = Xs[xi + 1] % 1 == 0 ? Xs[xi + 1] : Math.floor(Xs[xi + 1]);
                var left = Xs[xi];
                var right = Xs[xi + 1];
                // console.log("BEFORE: ", left, right);
                // left  = Xs[xi]     % 1 === 0 ? Xs[xi]     : Math.ceil(Xs[xi]);
                // right = Xs[xi + 1] % 1 === 0 ? Xs[xi + 1] : Math.floor(Xs[xi]);
                // console.log("AFTER : ", left, right);
                this.drawLine(new Point_1.Point(left, y), new Point_1.Point(right, y), colour);
            }
        }
        // this.drawPolygon(poly, colour);
    };
    /**
     * Other algorithm to fill a polygon
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.otherFill = function (poly, colour) {
    };
    /**
     * Fills a polygon based on the method decided on at initialization
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.fillPolygon = function (poly, colour) {
        var _this = this;
        if (this.fillMethod === null || this.fillMethod === 'scanLine') {
            // dont decompose if the polygon is a triangle
            var triangles = poly.points.length === 3 ? [poly] : poly.decompose();
            triangles.forEach(function (t) {
                _this.scanLineFill(t, colour);
                _this.drawPolygon(t, Colour_1.Colours.red);
            });
        }
        else {
            // this.otherFill(poly, colour);
        }
    };
    /**
     * Draws the polygon
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.drawPolygon = function (poly, colour) {
        var _this = this;
        var points = poly.points;
        // multiply these points by the translation matrix
        // points.forEach(p => {
        //     Utils.matrixMultiply([p.x, p.y, 0], this.translationMatrixs[this.translationMatrixs.length - 1]);
        // });
        console.log('Updating points');
        points.forEach(function (p) {
            var pMatrix = new Matrix_1.Matrix([[p.x], [p.y], [1]]);
            console.log('The transformation matrix used is');
            console.log(_this.transformationMatrices[_this.transformationMatrices.length - 1]);
            var res = _this.transformationMatrices[_this.transformationMatrices.length - 1].multiply(pMatrix);
            console.log('original');
            console.log(pMatrix);
            console.log('after');
            console.log(res);
            p.x = res.values[0][0];
            p.y = res.values[1][0];
        });
        for (var i = 0; i < points.length - 1; i++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
        this.drawLine(points[points.length - 1], points[0], colour);
    };
    LGE.prototype.drawPolygonBuffer = function (buffer) {
        var _this = this;
        buffer.forEach(function (x) {
            _this.drawPolygon(x.poly, x.colour);
        });
    };
    /**
     * Draws a triangle from 3 points
     * @param points Points
     * @param colour Colour
     */
    LGE.prototype.drawTriangle = function (points, colour) {
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Fills a triangle from 3 points
     * @param points Point[]
     * @param colour Colour
     */
    LGE.prototype.fillTriangle = function (points, colour) {
        this.fillPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Draws a rectangle
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    LGE.prototype.drawRectangle = function (x, y, width, height, colour) {
        var points;
        points.push(new Point_1.Point(x, y));
        points.push(new Point_1.Point(x + width, y));
        points.push(new Point_1.Point(x, y + height));
        points.push(new Point_1.Point(x + width, y + height));
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Fills a rectangle
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    LGE.prototype.fillRectangle = function (x, y, width, height, colour) {
        var points;
        points.push(new Point_1.Point(x, y));
        points.push(new Point_1.Point(x + width, y));
        points.push(new Point_1.Point(x, y + height));
        points.push(new Point_1.Point(x + width, y + height));
        this.fillPolygon(new Polygon_1.Polygon(points), colour);
    };
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
    LGE.prototype.drawCircle = function (xc, yc, radius, samples, colour) {
        var points = [];
        var step = 1 / radius;
        for (var i = 1; i < samples; i++) {
            var x = xc + radius * Math.cos(i * step);
            var y = yc + radius * Math.sin(i * step);
            points.push(new Point_1.Point(x, y));
            points.push(new Point_1.Point(x, -y));
            points.push(new Point_1.Point(y, -x));
            points.push(new Point_1.Point(-y, -x));
            points.push(new Point_1.Point(-x, -y));
            points.push(new Point_1.Point(-x, y));
            points.push(new Point_1.Point(-y, x));
            points.push(new Point_1.Point(y, x));
        }
        // console.log(points);
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
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
    LGE.prototype.fillCircle = function (x, y, radius, samples, colour) {
        var points;
        for (var i = 1; i < samples; i++) {
            var p = new Point_1.Point(radius * (Math.cos((2 * Math.PI) / i)), radius * (Math.sin((2 * Math.PI) / i)));
            points.push(p);
        }
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Clears the canvas
     */
    LGE.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
    };
    LGE.prototype.addTranslations = function (translationMatrix) {
        // this.translationMatrixs.push(translationMatrix);
    };
    LGE.prototype.popTranslation = function (count) {
        if (count === undefined) {
            // check this
            count = 1;
        }
        // this.translationMatrixs.pop(count);
    };
    return LGE;
}());
exports.LGE = LGE;

},{"./Colour":1,"./Matrix":3,"./Pixel":4,"./Point":5,"./Polygon":6}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Matrix Class
 */
var Matrix = /** @class */ (function () {
    function Matrix(values) {
        this.identityMatrix = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        if (values === null) {
            this.values = JSON.parse(JSON.stringify(this.identityMatrix));
        }
        else {
            this.values = values;
        }
        this.width = this.values[0].length;
        this.height = this.values.length;
    }
    Matrix.prototype.add = function (b) {
        if (this.width !== b.width && this.height !== b.height) {
            throw new Error('Dimension miss match');
        }
        var out = new Matrix(null);
        out.zero();
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                out.values[i][j] = this.values[i][j] + b.values[i][j];
            }
        }
        return out;
    };
    Matrix.prototype.multiply = function (b) {
        // if (this.width != b.height || this.height != b.width) {
        //     throw new Error('Dimension miss match');
        // }
        var res = [0, 0, 0];
        // for (let i = 0; i < this.values.length; i ++) {
        //     for (let j = 0; j < this.values[i].length; j ++) {
        //         res[i] += this.values[i][j] * b.values[j][0];
        //     }
        // }
        var x = JSON.stringify(this.values);
        var y = JSON.stringify(b.values);
        var z = JSON.stringify(res);
        console.log('This:');
        console.log(JSON.parse(x));
        console.log('B: ');
        console.log(JSON.parse(y));
        res[0] = this.values[0][0] * b.values[0][0] + this.values[0][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];
        res[1] = this.values[1][0] * b.values[0][0] + this.values[1][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];
        res[2] = this.values[2][0] * b.values[0][0] + this.values[2][1] * b.values[1][0] + this.values[0][2] * b.values[2][0];
        console.log('RES: ');
        console.log(res);
        return new Matrix([[res[0]], [res[1]], [res[2]]]);
    };
    Matrix.prototype.zero = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.values[i][j] = 0;
            }
        }
    };
    return Matrix;
}());
exports.Matrix = Matrix;
;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Rectangle_1 = require("./Rectangle");
/**
 * Represents a 'pixel'
 */
var Pixel = /** @class */ (function () {
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
    function Pixel(x, y, size, ctx, colour) {
        // console.log(x, y);
        this.rec = new Rectangle_1.Rectangle(Math.round(x), Math.round(y), ctx, size, size, colour);
        this.rec.draw();
    }
    return Pixel;
}());
exports.Pixel = Pixel;

},{"./Rectangle":7}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Represents a point
 */
var Point = /** @class */ (function () {
    /**
     *
     * @param x x pos
     * @param y y pos
     */
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;

},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Utils_1 = require("./Utils");
/**
 * Represents a polygon
 */
var Polygon = /** @class */ (function () {
    /**
     *
     * @param points points that represent the polygon
     */
    function Polygon(points) {
        this.points = points;
        this.triangles = [];
    }
    /**
     * decomposes the polygon into triangles
     * @returns an array of polygons
     */
    Polygon.prototype.decompose = function () {
        if (this.points.length === 3) {
            // dont want to create a cycle so create new polygon
            this.triangles.push(new Polygon(this.points));
            return this.triangles;
        }
        // const oldPoints = this.points.slice(0, this.points.length);
        // while (this.points.length >= 3) {
        //     this.triangles.push(new Polygon([this.points[0], 
        //                                      this.points[1 % this.points.length], 
        //                                      this.points[2 % this.points.length]]));
        //     this.points.splice(1 % this.points.length, 1);
        // }
        // this.points = oldPoints.slice(0, oldPoints.length);
        // return this.triangles;
        var tempPoints = this.points.slice(0, this.points.length);
        while (tempPoints.length > 3) {
            for (var i = 0; i < tempPoints.length; i++) {
                var prev = (i - 1 + tempPoints.length) % tempPoints.length;
                var next = (i + 1) % tempPoints.length;
                var t = [tempPoints[i], tempPoints[prev], tempPoints[next]];
                var noneIn = true;
                for (var j = 0; j < tempPoints.length; j++) {
                    if (j != i && j != next && Utils_1.Utils.insideTriangle(tempPoints[j], new Polygon(t))) {
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
    };
    /**
     * Translate position by deltaX, deltaY
     * @param deltaX change in x
     * @param deltaY change in y
     *
     * @returns Polygon
     */
    Polygon.prototype.translate = function (x, y) {
        this.points.forEach(function (p) {
            p.x += x;
            p.y += y;
        });
        return this;
    };
    /**
     * Scales all the points by x and y
     * @param x x multiplier
     * @param y y multiplier
     *
     * @returns Polygon
     */
    Polygon.prototype.scale = function (x, y) {
        this.points.forEach(function (p) {
            p.x = Math.round(p.x * x);
            p.y = Math.round(p.y * y);
        });
        return this;
    };
    return Polygon;
}());
exports.Polygon = Polygon;

},{"./Utils":9}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Rectangle = /** @class */ (function () {
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
    function Rectangle(x, y, ctx, width, height, colour) {
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
    Rectangle.prototype.draw = function () {
        this.ctx.fillStyle = this.fill;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;

},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Point_1 = require("./Point");
var Polygon_1 = require("./Polygon");
var Utils_1 = require("./Utils");
/**
 * Factory to that returns shapes
 */
var ShapeFactory = /** @class */ (function () {
    function ShapeFactory() {
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
    ShapeFactory.prototype.square = function (x, y, width, height) {
        var points = [];
        points.push(new Point_1.Point(x, y));
        points.push(new Point_1.Point(x + width, y));
        points.push(new Point_1.Point(x + width, y + height));
        points.push(new Point_1.Point(x, y + height));
        return new Polygon_1.Polygon(points);
    };
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
    ShapeFactory.prototype.polygon = function (x, y, width, height, nPoints) {
        var points = [];
        for (var i = 0; i < nPoints; i++) {
            points.push(new Point_1.Point(x + Utils_1.Utils.randomInt(width), y + Utils_1.Utils.randomInt(height)));
        }
        return new Polygon_1.Polygon(points);
    };
    return ShapeFactory;
}());
exports.ShapeFactory = ShapeFactory;

},{"./Point":5,"./Polygon":6,"./Utils":9}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Utility Class
 */
var Utils = /** @class */ (function () {
    function Utils() {
        this.identityMatrix = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }
    /**
     * Generates a random number [0...max]
     * @param max max number
     * @returns random number between 0 and max
     */
    Utils.randomInt = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    /**
     * Are the points on the same side
     * @param a point
     * @param b point
     * @param l1 line1
     * @param l2 line2
     *
     * @returns boolean
     */
    Utils.sameSide = function (a, b, l1, l2) {
        var apt = (a.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (a.y - l1.y);
        var bpt = (b.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (b.y - l1.y);
        return ((apt * bpt) > 0);
    };
    /**
     * Is a point in a triangle
     * @param p point
     * @param t triangle
     *
     * @returns boolean
     */
    Utils.insideTriangle = function (p, t) {
        var _a = t.points, a = _a[0], b = _a[1], c = _a[2];
        return this.sameSide(p, a, b, c) && this.sameSide(p, b, a, c) && this.sameSide(p, c, a, b);
    };
    return Utils;
}());
exports.Utils = Utils;

},{}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Colour_1 = require("./Colour");
var ShapeFactory_1 = require("./ShapeFactory");
var LGE_1 = require("./LGE");
var Matrix_1 = require("./Matrix");
/**
 * Get reference to the canvas element and its 2D rendering context
 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
/**
 * Set the width here not in the HTML
 */
canvas.width = 800;
canvas.height = 800;
/**
 * Instantiate the graphics engine - using the scanLine fill method
 */
var lge = new LGE_1.LGE(ctx, 4, 'scanLine');
/**
 * Instantiate Shape Factory
 */
var sf = new ShapeFactory_1.ShapeFactory();
var points;
var square = sf.square(300, 210, 100, 100);
var drawBuffer = [];
var drawBufferExecute = function () {
    drawBuffer.forEach(function (x) {
        console.log(x);
        // cant use ...x.args :(
        x.func(x.args[0], x.args[1]);
    });
};
// drawBuffer.push({func : lge.fillPolygon, args : [square, Colours.white]});
drawBuffer.push({ poly: square, colour: Colour_1.Colours.white });
// drawBufferExecute();
// lge.drawPolygon(drawBuffer[0].args[0], drawBuffer[0].args[1]);
// const run = () => {
//     // console.log(drawBuffer);
//     lge.clear();
//     lge.drawPolygonBuffer(drawBuffer);
//     // drawBufferExecute();
//     window.requestAnimationFrame(run);
// }
// run();
lge.drawPolygon(square, Colour_1.Colours.white);
lge.setRotation(Math.PI / 4);
lge.setTranslation(100, 100);
lge.drawPolygon(square, Colour_1.Colours.black);
var a = new Matrix_1.Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);
var b = new Matrix_1.Matrix([
    [2],
    [2],
    [1]
]);
var c = a.multiply(b);
console.log('RESULT');
console.log(c.values);
// let c : Matrix = a.multiply(b);
// console.log('C');
// console.log(c.values);

},{"./Colour":1,"./LGE":2,"./Matrix":3,"./ShapeFactory":8}]},{},[1,2,3,4,5,6,7,8,10,9]);
