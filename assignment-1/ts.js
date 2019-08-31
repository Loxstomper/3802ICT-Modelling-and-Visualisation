(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Colour_1 = require("./Colour");
var Polygon_1 = require("./Polygon");
var Utils_1 = require("./Utils");
var Asteroid = /** @class */ (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid(centrePoint, resolution) {
        var _this = 
        // create the polygon
        _super.call(this, Asteroid.generatePoints(centrePoint), true) || this;
        _this.velocity = { x: 0, y: 0 };
        // set resolution
        _this.resolution = resolution;
        // rotation and velocity
        _this.rotationSpeed = 10 + Utils_1.Utils.randomInt(90) - 50;
        _this.velocity.x =
            Utils_1.Utils.randomInt(Asteroid.maxVelocity) - Asteroid.maxVelocity / 2;
        _this.velocity.y =
            Utils_1.Utils.randomInt(Asteroid.maxVelocity) - Asteroid.maxVelocity / 2;
        // colour
        var colour = Asteroid.colours[Utils_1.Utils.randomInt(Asteroid.colours.length)];
        _this.colour = colour;
        _this.fillColour = colour;
        _this.boundingBox.colour = Colour_1.Colours.green;
        return _this;
    }
    /**
     * Creates points for asteroid polygon
     * nPoints equally spaced around a circle within min/max radius
     *
     * @returns IPoint[]
     */
    Asteroid.generatePoints = function (centrePoint) {
        var points = [];
        var stepSize = (2 * Math.PI) / Asteroid.nPoints;
        var angle = 0;
        for (var i = 0; i < Asteroid.nPoints; i++) {
            var length_1 = Utils_1.Utils.randomInt(Asteroid.maxRadius - Asteroid.minRadius + 1) +
                Asteroid.minRadius;
            points.push({
                x: centrePoint.x + length_1 * Math.cos(angle),
                y: centrePoint.y + length_1 * Math.sin(angle)
            });
            angle += stepSize;
        }
        return points;
    };
    /**
     * Update physics
     * @param timeDelta time since last update
     */
    Asteroid.prototype.update = function (timeDelta) {
        // check if hit side of the canvas
        if (this.centrePoint.x + Asteroid.maxRadius >= this.resolution.x ||
            this.centrePoint.x - Asteroid.maxRadius <= 0) {
            this.velocity.x *= -1;
        }
        // check if hit top/bottom of canvas
        if (this.centrePoint.y + Asteroid.maxRadius >= this.resolution.y ||
            this.centrePoint.y - Asteroid.maxRadius <= 0) {
            this.velocity.y *= -1;
        }
        this.rotate(this.rotationSpeed * timeDelta);
        this.translate(this.velocity.x * timeDelta, this.velocity.y * timeDelta);
    };
    /**
     * inverts the velocity
     */
    Asteroid.prototype.bounce = function () {
        this.velocity.x *= -1;
        this.velocity.y *= -1;
        this.translate(this.velocity.x * 1.5, this.velocity.y * 1.5);
    };
    /**
     * handle collisions with other asteroids
     *
     * @param asteroids the asteroids array
     * @param currIndex the index of the current asteroid
     *
     * @returns number[] - indices of all the colliding asteroids
     */
    Asteroid.prototype.handleCollision = function (asteroids, currIndex) {
        var bb = this.boundingBox.points;
        var bbWidth = bb[2].x - bb[0].x;
        var bbHeight = bb[3].y - bb[0].y;
        var collisions = [];
        // check for collision
        for (var i = 0; i < asteroids.length; i++) {
            if (i === currIndex) {
                continue;
            }
            var abb = asteroids[i].boundingBox.points;
            var abbWidth = abb[2].x - bb[0].x;
            var abbHeight = abb[3].y - bb[0].y;
            if (!(bb[0].x + bbWidth < abb[0].x || // bb is to the left of abb
                abb[0].x + abbWidth < bb[0].x || // abb is to the left of bb
                bb[0].y + bbHeight < abb[0].y || // bb is above abb
                abb[0].y + abbHeight < bb[0].y) // abb is above bb
            ) {
                // invert velocity
                // this.velocity.x *= -1;
                // this.velocity.y *= -1;
                // // translate a bit to bounce
                // this.translate(this.velocity.x * 1.5, this.velocity.y * 1.5);
                collisions.push(i);
            }
        }
        return collisions;
    };
    Asteroid.minRadius = 30;
    Asteroid.maxRadius = 40;
    Asteroid.nPoints = 24;
    Asteroid.maxVelocity = 50;
    Asteroid.colours = [
        Colour_1.Colours.brown1,
        Colour_1.Colours.brown2,
        Colour_1.Colours.brown3
    ];
    return Asteroid;
}(Polygon_1.Polygon));
exports.Asteroid = Asteroid;
exports.asteroidFactory = function (resolution) {
    var x = 50 + Utils_1.Utils.randomInt(resolution.x - 100);
    var y = 50 + Utils_1.Utils.randomInt(resolution.y - 50);
    return new Asteroid({ x: x, y: y }, resolution);
};

},{"./Colour":2,"./Polygon":9,"./Utils":12}],2:[function(require,module,exports){
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
     *
     * @returns returns string format 'rgba(r, g, b, a)'
     */
    Colour.prototype.toString = function () {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };
    return Colour;
}());
exports.Colour = Colour;
exports.Colours = {
    black: new Colour(0, 0, 0, 100),
    blue: new Colour(0, 0, 255, 100),
    brown1: new Colour(135, 54, 0, 100),
    brown2: new Colour(110, 44, 0, 100),
    brown3: new Colour(93, 64, 55, 100),
    green: new Colour(0, 255, 0, 100),
    orange: new Colour(243, 156, 18, 100),
    red: new Colour(255, 0, 0, 100),
    silver: new Colour(192, 192, 192, 100),
    white: new Colour(255, 255, 255, 100)
};

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Drawable = /** @class */ (function () {
    function Drawable() {
        this.scale = 1;
        this.angle = 0;
    }
    return Drawable;
}());
exports.Drawable = Drawable;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Colour_1 = require("./Colour");
var Matrix_1 = require("./Matrix");
var Pixel_1 = require("./Pixel");
var Polygon_1 = require("./Polygon");
/**
 * Lochie Graphics Engine
 *
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
            [0, 0, 1]
        ];
        var res = new Matrix_1.Matrix(values);
        this.transformationMatrices.push(res);
        return res;
    };
    /**
     * sets rotation
     * @param angle
     */
    LGE.prototype.setRotation = function (angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        this.rotationMatrix.values = [[cosTheta, -sinTheta], [sinTheta, cosTheta]];
        this.updateTransformationMatrix();
    };
    /**
     * sets translation
     *
     * @param dX change in x
     * @param dY change in y
     */
    LGE.prototype.setTranslation = function (dX, dY) {
        this.translationMatrix.values = [[dX], [dY]];
        this.updateTransformationMatrix();
    };
    /**
     * Draws a coloured line between two points using the DDA algorithm
     *
     * @param start first IPoint
     * @param end end IPoint
     * @param colour Colour
     */
    LGE.prototype.drawLine = function (start, end, colour) {
        var p0 = start;
        var p1 = end;
        var dx = Math.ceil(p1.x - p0.x);
        var dy = Math.ceil(p1.y - p0.y);
        var steps = Math.abs(dx) > Math.abs(dy)
            ? Math.ceil(Math.abs(dx) / this.PIXEL_SIZE)
            : Math.ceil(Math.abs(dy) / this.PIXEL_SIZE);
        if (steps === 0) {
            // tslint:disable-next-line: no-unused-expression
            new Pixel_1.Pixel(p0.x, p0.y, this.PIXEL_SIZE, this.ctx, colour);
            return;
        }
        var xInc = dx / steps;
        var yInc = dy / steps;
        var x = p0.x;
        var y = p0.y;
        for (var i = 0; i < steps; i++) {
            // tslint:disable-next-line: no-unused-expression
            new Pixel_1.Pixel(x, y, this.PIXEL_SIZE, this.ctx, colour);
            x += xInc;
            y += yInc;
        }
    };
    /**
     * Draws lines between the points
     *
     * @param points IPoint[]
     * @param colour Colour
     */
    LGE.prototype.drawPath = function (points, colour) {
        for (var i = 0; i < points.length; i++) {
            this.drawLine(points[i], points[i + 1], colour);
        }
    };
    /**
     * Fills a polygon with the given colour
     *
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.scanLineFill = function (poly, colour) {
        var points = poly.points;
        var minY = points.reduce(function (prev, curr) {
            return prev.y < curr.y ? prev : curr;
        }).y;
        var maxY = points.reduce(function (prev, curr) {
            return prev.y > curr.y ? prev : curr;
        }).y;
        var start = points[points.length - 1];
        var edges = [];
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < points.length; i++) {
            edges.push({ 0: start, 1: points[i] });
            start = points[i];
        }
        for (var y = minY; y < maxY; y += this.PIXEL_SIZE) {
            var Xs = [];
            // tslint:disable-next-line: one-variable-per-declaration
            var x = void 0, x1 = void 0, x2 = void 0, y1 = void 0, y2 = void 0, deltaX = void 0, deltaY = void 0;
            // tslint:disable-next-line: prefer-for-of
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
                var left = Xs[xi];
                var right = Xs[xi + 1];
                this.drawLine({ x: left, y: y }, { x: right, y: y }, colour);
            }
        }
    };
    /**
     * Fills a polygon based on the method decided on at initialization
     *
     * @param poly Polygon
     * @param colour Colour
     */
    LGE.prototype.fillPolygon = function (poly, colour) {
        var _this = this;
        if (this.fillMethod === null || this.fillMethod === "scanLine") {
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
     * Draws the polygon, fills if a colour is provided
     *
     * @param poly Polygon
     * @param colour Optional Colour - overwrites polygon colour
     */
    LGE.prototype.drawPolygon = function (poly, colour) {
        var points = poly.points;
        if (poly.fillColour) {
            this.scanLineFill(poly, poly.fillColour);
        }
        var outlineColour = colour ? colour : poly.colour;
        for (var i = 0; i < points.length - 1; i++) {
            this.drawLine(points[i], points[i + 1], outlineColour);
        }
        this.drawLine(points[points.length - 1], points[0], outlineColour);
    };
    /**
     * Draws an array of Polygons
     *
     * @param buffer Polygon[]
     */
    LGE.prototype.drawPolygonBuffer = function (buffer) {
        var _this = this;
        buffer.forEach(function (p) {
            _this.drawPolygon(p);
        });
    };
    /**
     * Draws a triangle from 3 points
     *
     * @param points Points
     * @param colour Colour
     */
    LGE.prototype.drawTriangle = function (points, colour) {
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Fills a triangle from 3 points
     *
     * @param points IPoint[]
     * @param colour Colour
     */
    LGE.prototype.fillTriangle = function (points, colour) {
        this.fillPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Draws a rectangle
     *
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    LGE.prototype.drawRectangle = function (x, y, width, height, colour) {
        var points = [];
        points.push({ x: x, y: y });
        points.push({ x: x + width, y: y });
        points.push({ x: x, y: y + height });
        points.push({ x: x + width, y: y + height });
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Fills a rectangle
     *
     * @param x x pos
     * @param y y pos
     * @param width width
     * @param height height
     * @param colour Colour
     */
    LGE.prototype.fillRectangle = function (x, y, width, height, colour) {
        var points = [];
        points.push({ x: x, y: y });
        points.push({ x: x + width, y: y });
        points.push({ x: x, y: y + height });
        points.push({ x: x + width, y: y + height });
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
            points.push({ x: x, y: y });
            points.push({ x: x, y: -y });
            points.push({ x: y, y: -x });
            points.push({ x: -y, y: -x });
            points.push({ x: -x, y: -y });
            points.push({ x: -x, y: y });
            points.push({ y: -y, x: x });
            points.push({ x: y, y: x });
        }
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
        var points = [];
        for (var i = 1; i < samples; i++) {
            var p = {
                x: radius * Math.cos((2 * Math.PI) / i),
                y: radius * Math.sin((2 * Math.PI) / i)
            };
            points.push(p);
        }
        this.drawPolygon(new Polygon_1.Polygon(points), colour);
    };
    /**
     * Clears the whole canvas
     */
    LGE.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.resolution.x, this.resolution.y);
    };
    /**
     * Clears the canvas by clearing the polygon's bounding boxes
     *
     * @param polygons polygons to be cleared
     */
    LGE.prototype.clearSmart = function (polygons) {
        var _this = this;
        // going to clear each bounding box
        polygons.forEach(function (p) {
            var bb = p.boundingBox.points;
            var x = bb[0].x;
            var y = bb[0].y;
            var width = bb[1].x - x;
            var height = bb[2].y - y;
            _this.ctx.clearRect(x - 10 * _this.PIXEL_SIZE, y - 10 * _this.PIXEL_SIZE, width + 10 * _this.PIXEL_SIZE, height + 10 * _this.PIXEL_SIZE);
        });
        // clear the score and fps value
        this.ctx.clearRect(0, 0, 200, 200);
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

},{"./Colour":2,"./Matrix":6,"./Pixel":7,"./Polygon":9}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Matrix Class
 */
var Matrix = /** @class */ (function () {
    function Matrix(values) {
        this.identityMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
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
            throw new Error("Dimension miss match");
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
        res[0] =
            this.values[0][0] * b.values[0][0] +
                this.values[0][1] * b.values[1][0] +
                this.values[0][2] * b.values[2][0];
        res[1] =
            this.values[1][0] * b.values[0][0] +
                this.values[1][1] * b.values[1][0] +
                this.values[1][2] * b.values[2][0];
        res[2] =
            this.values[2][0] * b.values[0][0] +
                this.values[2][1] * b.values[1][0] +
                this.values[2][2] * b.values[2][0];
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

},{}],7:[function(require,module,exports){
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
        this.rec = new Rectangle_1.Rectangle(Math.round(x), Math.round(y), ctx, size, size, colour);
        this.rec.draw();
    }
    return Pixel;
}());
exports.Pixel = Pixel;

},{"./Rectangle":10}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Colour_1 = require("./Colour");
var Polygon_1 = require("./Polygon");
var Utils_1 = require("./Utils");
var controls = {
    BACKWARD: 83,
    FORWARD: 87,
    LEFT: 65,
    RIGHT: 68
};
var Player = /** @class */ (function () {
    function Player(resolution) {
        this.body = [];
        this.velocityVector = { x: 0, y: 0 };
        this.rotationSpeed = 180;
        this.angle = 0;
        this.score = 0;
        this.thrustPower = 10;
        this.drag = 1;
        this.isBoosted = false;
        this.resolution = resolution;
        this.body = [
            new Polygon_1.Polygon([
                { x: -40, y: 20 },
                { x: 40, y: 20 },
                { x: 40, y: -20 },
                { x: -40, y: -20 }
            ]),
            new Polygon_1.Polygon([{ x: 40, y: 20 }, { x: 60, y: 0 }, { x: 40, y: -20 }]),
            new Polygon_1.Polygon([{ x: -40, y: 20 }, { x: -40, y: 40 }, { x: -20, y: 20 }]),
            new Polygon_1.Polygon([{ x: -40, y: -20 }, { x: -40, y: -40 }, { x: -20, y: -20 }]),
            new Polygon_1.Polygon([
                { x: -20, y: 10 },
                { x: 20, y: 10 },
                { x: 20, y: -10 },
                { x: -20, y: -10 }
            ])
        ];
        // creates bounding box, use a dumby to initialise
        this.boundingBox = new Polygon_1.Polygon(this.body[0].points, false);
        this.updateBoundingBox();
        this.boundingBox.colour = Colour_1.Colours.green;
        // set colour for the body components
        this.body[0].colour = Colour_1.Colours.silver;
        this.body[0].fillColour = Colour_1.Colours.silver;
        this.body[1].colour = Colour_1.Colours.silver;
        this.body[1].fillColour = Colour_1.Colours.silver;
        this.body[2].colour = Colour_1.Colours.silver;
        this.body[2].fillColour = Colour_1.Colours.silver;
        this.body[3].colour = Colour_1.Colours.silver;
        this.body[3].fillColour = Colour_1.Colours.silver;
        this.body[4].colour = Colour_1.Colours.blue;
        this.body[4].fillColour = Colour_1.Colours.blue;
        // flames
        // this.flames = [
        //   new Polygon([{ x: -40, y: 20 }, { x: -60, y: 10 }, { x: -40, y: 0 }]),
        //   new Polygon([{ x: -40, y: 0 }, { x: -60, y: -10 }, { x: -40, y: -20 }]),
        //   new Polygon([{ x: -40, y: 10 }, { x: -80, y: 0 }, { x: -40, y: -10 }])
        // ];
        this.flames = [
            new Polygon_1.Polygon([
                { x: -40, y: 20 },
                { x: -60, y: 10 },
                { x: -40, y: 0 },
                { x: -60, y: -10 },
                { x: -40, y: 10 },
                { x: -80, y: 0 },
                { x: -40, y: -10 }
            ])
        ];
        this.flames.forEach(function (p) {
            p.colour = Colour_1.Colours.orange;
            p.fillColour = Colour_1.Colours.orange;
        });
        // move to the centre of the screen
        this.translate(this.resolution.x / 2, this.resolution.y / 2);
        this.centrePoint = Utils_1.Utils.calculateCentrePoint(this.boundingBox.points);
    }
    /**
     * Update the bounding box
     */
    Player.prototype.updateBoundingBox = function () {
        var points = [];
        this.body.forEach(function (p) {
            points.push.apply(points, p.points);
        });
        this.boundingBox.points = Utils_1.Utils.calculateBoundingBox(points);
    };
    /**
     * Rotate by angle degrees
     *
     * @param angle degrees
     */
    Player.prototype.rotate = function (angle) {
        var _this = this;
        this.angle += (angle * Math.PI) / 180;
        if (this.angle >= 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }
        if (this.angle <= -2 * Math.PI) {
            this.angle += 2 * Math.PI;
        }
        this.body.concat(this.flames).forEach(function (p) {
            p.rotate(angle, _this.centrePoint);
        });
        this.updateBoundingBox();
    };
    /**
     * Translate
     *
     * @param deltaX change in x
     * @param deltaY change in y
     */
    Player.prototype.translate = function (deltaX, deltaY) {
        this.body.concat(this.flames).forEach(function (p) {
            p.translate(deltaX, deltaY);
        });
        this.boundingBox.translate(deltaX, deltaY);
    };
    /**
     * Updates position based on user input
     *
     * @param pressedKeys current active keys
     * @param deltaTime time since last frame was rendered
     */
    Player.prototype.update = function (pressedKeys, deltaTime) {
        this.isBoosted = false;
        // need to do if ladder for multiple key inputs
        if (pressedKeys[controls.FORWARD]) {
            this.velocityVector.y +=
                this.thrustPower * Math.sin(this.angle) * deltaTime;
            this.velocityVector.x +=
                this.thrustPower * Math.cos(this.angle) * deltaTime;
            this.isBoosted = true;
        }
        if (pressedKeys[controls.LEFT]) {
            this.rotate(-this.rotationSpeed * deltaTime);
        }
        if (pressedKeys[controls.RIGHT]) {
            this.rotate(this.rotationSpeed * deltaTime);
        }
        this.translate(this.velocityVector.x, this.velocityVector.y);
        // update centrepoint
        this.centrePoint.x += this.velocityVector.x;
        this.centrePoint.y += this.velocityVector.y;
        if (this.drag !== 1) {
            this.velocityVector.x *= this.drag;
            this.velocityVector.y *= this.drag;
        }
        if (this.centrePoint.y <= 50 ||
            this.centrePoint.y >= this.resolution.y - 50) {
            this.velocityVector.y *= -0.5;
        }
        if (this.centrePoint.x <= 50 ||
            this.centrePoint.x >= this.resolution.x - 50) {
            this.velocityVector.x *= -0.5;
        }
    };
    /**
     * Checks if there is any collisions with the asteroids.
     *
     *
     * @param asteroids Asteroid[]
     * @returns number of collisions
     */
    Player.prototype.handleCollision = function (asteroids) {
        var bb = this.boundingBox.points;
        var bbWidth = bb[2].x - bb[0].x;
        var bbHeight = bb[3].y - bb[0].y;
        var numberCollisions = 0;
        // check for collision
        for (var i = 0; i < asteroids.length; i++) {
            var abb = asteroids[i].boundingBox.points;
            var abbWidth = abb[2].x - bb[0].x;
            var abbHeight = abb[3].y - bb[0].y;
            if (!(bb[0].x + bbWidth < abb[0].x || // bb is to the left of abb
                abb[0].x + abbWidth < bb[0].x || // abb is to the left of bb
                bb[0].y + bbHeight < abb[0].y || // bb is above abb
                abb[0].y + abbHeight < bb[0].y) // abb is above bb
            ) {
                // delete asteroids[i];
                asteroids.splice(i, 1);
                numberCollisions++;
                this.score++;
            }
        }
        return numberCollisions;
    };
    return Player;
}());
exports.Player = Player;

},{"./Colour":2,"./Polygon":9,"./Utils":12}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Colour_1 = require("./Colour");
var Matrix_1 = require("./Matrix");
var Utils_1 = require("./Utils");
/**
 * Represents a polygon
 */
var Polygon = /** @class */ (function () {
    /**
     *
     * @param points points that represent the polygon
     */
    function Polygon(points, hasBoundingBox) {
        this.transformationMatrix = new Matrix_1.Matrix(null);
        this.fillColour = null;
        this.points = points;
        this.triangles = [];
        this.centrePoint = Utils_1.Utils.calculateCentrePoint(points);
        this.colour = Colour_1.Colours.black;
        if (hasBoundingBox) {
            this.boundingBox = new Polygon(Utils_1.Utils.calculateBoundingBox(this.points));
            this.boundingBox.colour = Colour_1.Colours.green;
        }
        this.scale = 1;
    }
    /**
     * decomposes the polygon into triangles.
     * returns the triangles but also updates the triangles property
     *
     * @returns Polygon[]
     */
    Polygon.prototype.decompose = function () {
        if (this.points.length === 3) {
            // dont want to create a cycle so create new polygon
            this.triangles.push(new Polygon(this.points));
            return this.triangles;
        }
        var tempPoints = this.points.slice(0, this.points.length);
        while (tempPoints.length > 3) {
            for (var i = 0; i < tempPoints.length; i++) {
                var prev = (i - 1 + tempPoints.length) % tempPoints.length;
                var next = (i + 1) % tempPoints.length;
                var t = [tempPoints[i], tempPoints[prev], tempPoints[next]];
                var noneIn = true;
                for (var j = 0; j < tempPoints.length; j++) {
                    if (j !== i &&
                        j !== next &&
                        Utils_1.Utils.insideTriangle(tempPoints[j], new Polygon(t))) {
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
     *
     * @param deltaX change in x
     * @param deltaY change in y
     *
     * @returns Polygon
     */
    Polygon.prototype.translate = function (deltaX, deltaY) {
        var _this = this;
        // update values
        this.transformationMatrix.values[0][2] = deltaX;
        this.transformationMatrix.values[1][2] = deltaY;
        // update all the points
        this.points.forEach(function (p, i) {
            var pMatrix = new Matrix_1.Matrix([[p.x], [p.y], [1]]);
            var res = _this.transformationMatrix.multiply(pMatrix);
            _this.points[i] = { x: res.values[0][0], y: res.values[1][0] };
        });
        // update values [reset]
        this.transformationMatrix.values[0][2] = 0;
        this.transformationMatrix.values[1][2] = 0;
        // update centrepoint and bounding box
        this.centrePoint.x += deltaX;
        this.centrePoint.y += deltaY;
        if (this.boundingBox) {
            this.boundingBox.translate(deltaX, deltaY);
        }
    };
    /**
     * Moves the centrepoint of the polygon to (x, y)
     *
     * @remarks not recommended
     * @param x x pos
     * @param y y pos
     */
    Polygon.prototype.moveTo = function (x, y) {
        var _this = this;
        var offsets = [];
        this.points.forEach(function (p) {
            offsets.push({
                x: _this.centrePoint.x - p.x,
                y: _this.centrePoint.y - p.y
            });
        });
        this.centrePoint = { x: x, y: y };
        for (var i = 0; i < offsets.length; i++) {
            this.points[i].x = this.centrePoint.x + offsets[i].x;
            this.points[i].y = this.centrePoint.y + offsets[i].y;
        }
    };
    /**
     * Rotate the polygon by angle degrees.
     * If no point is supplied the rotation point is the centrepoint of the polygon
     *
     * @param angle degrees
     * @param point optional point to rotate around
     */
    Polygon.prototype.rotate = function (angle, point) {
        var _this = this;
        var theta = (angle * Math.PI) / 180;
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        var tm = this.transformationMatrix;
        // update the transformation matrix
        tm.values[0][0] = cosTheta;
        tm.values[0][1] = -sinTheta;
        tm.values[1][0] = sinTheta;
        tm.values[1][1] = cosTheta;
        // rotation point
        var rp = point ? point : this.centrePoint;
        // update transformation matrix
        tm.values = [
            [cosTheta, -sinTheta, rp.x - cosTheta * rp.x - -sinTheta * rp.y],
            [sinTheta, cosTheta, rp.y - sinTheta * rp.x - cosTheta * rp.y],
            [0, 0, 1]
        ];
        // update all the points
        this.points.forEach(function (p, i) {
            var pMatrix = new Matrix_1.Matrix([[p.x], [p.y], [1]]);
            var res = tm.multiply(pMatrix);
            _this.points[i] = { x: res.values[0][0], y: res.values[1][0] };
        });
        if (this.boundingBox !== undefined) {
            this.updateBoundingBox();
        }
        // update the transformation matrix [reset angle]
        tm.values[0][0] = 1;
        tm.values[0][1] = 0;
        tm.values[1][0] = 0;
        tm.values[1][1] = 1;
        // translation
        tm.values[0][2] = 0;
        tm.values[1][2] = 0;
    };
    /**
     * Update the bounding box of the polygon
     */
    Polygon.prototype.updateBoundingBox = function () {
        this.boundingBox.points = Utils_1.Utils.calculateBoundingBox(this.points);
    };
    return Polygon;
}());
exports.Polygon = Polygon;

},{"./Colour":2,"./Matrix":6,"./Utils":12}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
    ShapeFactory.prototype.square = function (x, y, width, height, boundingBox) {
        var points = [];
        points.push({ x: x, y: y });
        points.push({ x: x + width, y: y });
        points.push({ x: x + width, y: y + height });
        points.push({ x: x, y: y + height });
        return new Polygon_1.Polygon(points, boundingBox);
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
            points.push({
                x: x + Utils_1.Utils.randomInt(width),
                y: y + Utils_1.Utils.randomInt(height)
            });
        }
        return new Polygon_1.Polygon(points);
    };
    return ShapeFactory;
}());
exports.ShapeFactory = ShapeFactory;

},{"./Polygon":9,"./Utils":12}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Utility Class
 */
var Utils = /** @class */ (function () {
    function Utils() {
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
     *
     * @param a IPoint
     * @param b IPoint
     * @param l1 line1
     * @param l2 line2
     *
     * @returns boolean
     */
    Utils.sameSide = function (a, b, l1, l2) {
        var apt = (a.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (a.y - l1.y);
        var bpt = (b.x - l1.x) * (l2.y - l1.y) - (l2.x - l1.x) * (b.y - l1.y);
        return apt * bpt > 0;
    };
    /**
     * Is a IPoint in a triangle
     *
     * @param p IPoint
     * @param t triangle
     *
     * @returns boolean
     */
    Utils.insideTriangle = function (p, t) {
        var _a = t.points, a = _a[0], b = _a[1], c = _a[2];
        return (this.sameSide(p, a, b, c) &&
            this.sameSide(p, b, a, c) &&
            this.sameSide(p, c, a, b));
    };
    /**
     * Calculates a rectangle bounding box from the supplied points
     *
     * @param points IPoint[]
     * @returns IPoint[]
     */
    Utils.calculateBoundingBox = function (points) {
        var minX = Number.POSITIVE_INFINITY;
        var minY = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        var maxY = Number.NEGATIVE_INFINITY;
        // better than doing 4 reduces
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            if (p.x < minX) {
                minX = p.x;
            }
            if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            }
            if (p.y > maxY) {
                maxY = p.y;
            }
        }
        return [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: maxX, y: maxY },
            { x: minX, y: maxY }
        ];
    };
    /**
     * Calculates the centre point from a series of points from the bounding box
     *
     * @param points IPoint[]
     * @returns IPoint
     */
    Utils.calculateCentrePoint = function (points) {
        var boundingBox = Utils.calculateBoundingBox(points);
        return {
            x: (boundingBox[2].x + boundingBox[0].x) / 2,
            y: (boundingBox[3].y + boundingBox[0].y) / 2
        };
    };
    return Utils;
}());
exports.Utils = Utils;

},{}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Asteroid_1 = require("./Asteroid");
var Colour_1 = require("./Colour");
var LGE_1 = require("./LGE");
var Player_1 = require("./Player");
var Utils_1 = require("./Utils");
/**
 * binds HTML elements to functions and populates input fields
 */
var HtmlElementBindings = function () {
    document
        .getElementById("canvas")
        .addEventListener("click", Game.filters.switchFilter, false);
    document.getElementById("toggleBoundingBox").addEventListener("click", function (e) {
        Game.config.showBoundingBoxes = !Game.config.showBoundingBoxes;
    }, false);
    document.getElementById("toggleFpsDisplay").addEventListener("click", function (e) {
        Game.config.showFps = !Game.config.showFps;
    }, false);
    document.getElementById("updateResolution").addEventListener("click", function (e) {
        var x = parseInt(document.getElementById("resolutionX").value, 10);
        var y = parseInt(document.getElementById("resolutionY").value, 10);
        Game.config.resolution = { x: x, y: y };
        setup();
    }, false);
    document.getElementById("updateMaxAsteroids").addEventListener("click", function (e) {
        Game.config.maxNumberAsteroids = parseInt(document.getElementById("maxNumberAsteroids")
            .value, 10);
        while (Game.state.numberAsteroids > Game.config.maxNumberAsteroids) {
            Game.objects.asteroids.pop();
            Game.state.numberAsteroids--;
        }
    }, false);
    document.getElementById("updatePixelSize").addEventListener("click", function (e) {
        var pixelSize = parseInt(document.getElementById("pixelSize").value, 10);
        Game.config.pixelSize = pixelSize;
        setup();
    }, false);
};
var updateHtmlElementValues = function () {
    document.getElementById("resolutionX").value = Game.config.resolution.x.toString();
    document.getElementById("resolutionY").value = Game.config.resolution.y.toString();
    document.getElementById("maxNumberAsteroids").value = Game.config.maxNumberAsteroids.toString();
    document.getElementById("pixelSize").value = Game.config.pixelSize.toString();
};
/**
 * Ran on start
 */
var setup = function () {
    // Fetch canvas and set size
    Game.canvas = document.getElementById("canvas");
    Game.canvasCtx = Game.canvas.getContext("2d");
    Game.canvas.width = Game.config.resolution.x;
    Game.canvas.height = Game.config.resolution.y;
    // Event listeners for input
    window.addEventListener("keydown", Game.input.onKeyDown, false);
    window.addEventListener("keyup", Game.input.onKeyUp, false);
    // window.addEventListener("click", Game.filters.switchFilter, false);
    // Instantiate graphics engine
    Game.graphicsEngine = new LGE_1.LGE(Game.canvasCtx, Game.config.pixelSize, "scanLine");
    // Instantiate player
    Game.objects.player = new Player_1.Player(Game.config.resolution);
    // in case of resetting the game
    Game.state.numberAsteroids = 0;
    Game.objects.asteroids = [];
    // create the initial asteroids
    while (Game.state.numberAsteroids < Game.config.maxNumberAsteroids) {
        Game.objects.asteroids.push(Asteroid_1.asteroidFactory(Game.config.resolution));
        Game.state.numberAsteroids++;
    }
    updateHtmlElementValues();
};
/**
 * Called before Draw function.
 * Updates the physics
 *
 */
var update = function () {
    // updates
    Game.objects.player.update(Game.input.pressedKeys, Game.state.frameTimeDelta);
    var colliders = [];
    // split on purpose
    Game.objects.asteroids.forEach(function (a, index) {
        colliders.push.apply(colliders, a.handleCollision(Game.objects.asteroids, index));
    });
    colliders = colliders.filter(function (v, i, a) { return a.indexOf(v) === i; });
    colliders.forEach(function (i) {
        Game.objects.asteroids[i].bounce();
    });
    Game.objects.asteroids.forEach(function (a, index) {
        a.update(Game.state.frameTimeDelta);
    });
    var prevAsteroids = Game.state.numberAsteroids;
    Game.state.numberAsteroids -= Game.objects.player.handleCollision(Game.objects.asteroids);
    if (prevAsteroids !== Game.state.numberAsteroids) {
        new Audio(Game.sounds.explosion).play();
    }
    if (Game.state.numberAsteroids < Game.config.maxNumberAsteroids &&
        Utils_1.Utils.randomInt(10) <= Game.config.asteroidSpawnProbability) {
        Game.objects.asteroids.push(Asteroid_1.asteroidFactory(Game.config.resolution));
        Game.state.numberAsteroids++;
    }
};
/**
 * Draws frame
 */
var draw = function () {
    Game.graphicsEngine.clear();
    var toDraw = Game.objects.player.body.concat(Game.objects.asteroids);
    if (Game.objects.player.isBoosted) {
        Game.sounds.thrust.play();
        toDraw.push.apply(toDraw, Game.objects.player.flames);
    }
    else {
        if (!Game.sounds.thrust.paused) {
            Game.sounds.thrust.pause();
            Game.sounds.thrust.currentTime = 0;
        }
    }
    // do this then commit
    if (Game.config.showBoundingBoxes) {
        toDraw.push(Game.objects.player.boundingBox);
        Game.objects.asteroids.forEach(function (a) {
            toDraw.push(a.boundingBox);
        });
    }
    Game.graphicsEngine.drawPolygonBuffer(toDraw);
    Game.canvasCtx.fillStyle = Colour_1.Colours.white.toString();
    Game.canvasCtx.font = "30px Arial";
    Game.canvasCtx.fillText("Score: " + Game.objects.player.score, 10, 50);
    if (Game.config.showFps) {
        Game.canvasCtx.fillText("FPS: " + Math.floor(1 / Game.state.frameTimeDelta), 10, 100);
    }
};
/**
 * Key press event
 * @param e
 */
var onKeyDown = function (e) {
    Game.input.pressedKeys[e.keyCode] = true;
};
/**
 * Key release event
 * @param e
 */
var onKeyUp = function (e) {
    Game.input.pressedKeys[e.keyCode] = false;
};
/**
 * Switches applied CSS filter to the canvas
 */
var switchFilter = function () {
    Game.canvas.style.filter = Game.filters.list[Game.filters.selectedFilter];
    Game.filters.selectedFilter =
        (Game.filters.selectedFilter + 1) % Game.filters.list.length;
};
var Game = {
    canvas: null,
    canvasCtx: null,
    config: {
        asteroidSpawnProbability: 1,
        maxNumberAsteroids: 10,
        pixelSize: 4,
        resolution: { x: 1280, y: 720 },
        showBoundingBoxes: true,
        showFps: true
    },
    draw: draw,
    filters: {
        list: [
            "",
            "blur(2px)",
            "hue-rotate(90deg)",
            "grayscale(100%)",
            "invert(100%)",
            "saturate(200%)"
        ],
        selectedFilter: 0,
        switchFilter: switchFilter
    },
    graphicsEngine: null,
    input: {
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        pressedKeys: {}
    },
    objects: {
        asteroids: [],
        player: null
    },
    setup: setup,
    sounds: {
        explosion: "./sounds/explosion.mp3",
        thrust: new Audio("./sounds/rocket.mp3") // only one instance
    },
    state: {
        frameTimeDelta: 0,
        lastFrameTime: 0,
        numberAsteroids: 0
    },
    update: update
};
/**
 * The game loop
 * @param timestamp time since last called
 */
var loop = function (timestamp) {
    // Calculate delta
    Game.state.frameTimeDelta = (timestamp - Game.state.lastFrameTime) / 1000;
    Game.state.lastFrameTime = timestamp;
    Game.update();
    Game.draw();
    // Call the game loop on the next animation frame
    requestAnimationFrame(loop);
};
HtmlElementBindings();
// Setup game
Game.setup();
// Start the game loop
requestAnimationFrame(loop);

},{"./Asteroid":1,"./Colour":2,"./LGE":5,"./Player":8,"./Utils":12}]},{},[1,2,3,4,5,13,6,7,8,9,10,11,12]);
