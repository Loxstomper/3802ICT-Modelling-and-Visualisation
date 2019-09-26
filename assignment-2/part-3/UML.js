(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Class = /** @class */ (function () {
    function Class(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    Class.prototype.getWidth = function () {
        return 1;
    };
    Class.prototype.getHeight = function () {
        return 1;
    };
    return Class;
}());
exports.Class = Class;

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var minimumX = 20;
var minimumY = 20;
var maxLineLength = 50;
var horizontalPadding = 10;
var verticalPadding = 10;
var Draw = /** @class */ (function () {
    function Draw(canvas, width, height) {
        this.currentX = 0;
        this.currentY = 0;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
        this.currentX = horizontalPadding;
        this.currentY = verticalPadding;
    }
    /**
     * Creates a UML diagram from the classes
     *
     * @param classes the classes to be drawn
     */
    Draw.prototype.draw = function (classes) {
        var _this = this;
        if (!classes) {
            return;
        }
        // first wrap text and calculating bounding boxes
        this.classes = classes;
        classes.forEach(function (c) {
            _this.wrapText(c);
        });
        var x = 10;
        var startY = 10;
        classes.forEach(function (c, index) {
            // only draw top level classes
            if (c.parent === undefined) {
                _this.drawClass(x, startY, c);
                if (index > 0) {
                    x += classes[index - 1].width + Draw.minClassHorizontalPadding;
                    // calculate the max width of the class before [children included]
                    // this is the bounding box
                }
                else {
                    x += 200;
                }
            }
        });
        this.classes = undefined;
    };
    Draw.prototype.drawClassName = function (x, y, c) {
        this.ctx.font = "bold " + Draw.textSize + "px arial";
        var size = this.ctx.measureText(c.name);
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.rect(
        // this.currentX,
        // this.currentY,
        x, y, c.width + 5, Draw.textSize + 10);
        c.height = y + Draw.textSize + 10;
        this.ctx.stroke();
        this.ctx.fillText(c.name, x + c.width / 2 - size.width / 2 + 2.5, y + 15);
    };
    Draw.prototype.drawClassProperties = function (x, y, c) {
        var _this = this;
        this.ctx.font = Draw.textSize + "px arial";
        console.log("drawing properties for ", c);
        // c.height = Draw.textSize * c.properties.length;
        // c.properties.forEach((p: string) => {
        //   this.ctx.fillText(p, x + 5, y + 5);
        //   y += Draw.textSize;
        // });
        c.properties.forEach(function (p, index) {
            _this.ctx.fillText(p, x + Draw.textHorizontalPadding, y + (index * Draw.textSize) + 5);
            y += Draw.textSize;
        });
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.rect(
        // this.currentX,
        // this.currentY + Draw.nameHeight + 5,
        x, c.height, c.width + Draw.textHorizontalPadding, y - c.height);
        c.height = y;
        this.ctx.stroke();
    };
    /**
     * Draw the class methods
     *
     * @param x x position
     * @param y y position
     * @param c class
     */
    Draw.prototype.drawClassMethods = function (x, y, c) {
        var _this = this;
        this.ctx.font = Draw.textSize + "px arial";
        console.log("drawing methods for for ", c);
        this.ctx.strokeStyle = "blue";
        c.methods.forEach(function (m) {
            // draw normally if no new line characters
            if (m.indexOf("\n") === -1) {
                _this.ctx.fillText(m, x + 5, y + 5);
            }
            else {
                // split on new line character
                var lines = m.split("\n");
                // draw each line
                lines.forEach(function (l, index) {
                    // dont indent
                    if (index === 0) {
                        _this.ctx.fillText("" + l, x + 5, y + 5);
                    }
                    else {
                        _this.ctx.fillText("\t\t" + l, x + 5, y + 5);
                    }
                    y += Draw.textSize;
                });
            }
            y += Draw.textSize;
        });
        this.ctx.beginPath();
        this.ctx.rect(x, c.height, c.width + 5, y - c.height);
        this.ctx.stroke();
        c.height = y;
    };
    Draw.prototype.wrapText = function (c) {
        var _this = this;
        this.ctx.font = "bold " + Draw.textSize + "px arial";
        var size = this.ctx.measureText(c.name);
        // width of name
        c.width = size.width;
        // height of name + padding
        c.height = Draw.textSize + 10;
        this.ctx.font = Draw.textSize + "px arial";
        if (c.properties) {
            c.height += 10;
            c.properties.forEach(function (p) {
                var pSize = _this.ctx.measureText(p);
                if (pSize.width > Draw.maxLineLength) {
                    console.log(p + " is too long");
                }
                if (pSize.width > c.width) {
                    c.width = pSize.width + 20;
                    c.height += Draw.textSize;
                }
            });
        }
        if (c.methods) {
            c.height += 10;
            //   c.methods.forEach((m: string) => {
            //     let mSize: TextMetrics = this.ctx.measureText(m);
            //     let farIndex = m.length;
            //     while (mSize.width > Draw.maxLineLength) {
            //       console.log(`${m} is too long`);
            //       // atempt to add new line character after a comma
            //       const i = m.lastIndexOf(",", farIndex);
            //       farIndex = i;
            //       const shorter = m.slice(0, farIndex) + "\n" + m.slice(farIndex);
            //       console.log(shorter);
            //       if (farIndex === 0) {
            //         break;
            //       }
            //     }
            //     if (mSize.width > c.width) {
            //       c.width = mSize.width;
            //       c.height += Draw.textSize;
            //     }
            //   });
            // probably going to have to draw bottom up
            // fillText doesnt support multi line
            c.methods = c.methods.map(function (m) {
                var mSize = _this.ctx.measureText(m);
                var farIndex = m.length;
                while (mSize.width > Draw.maxLineLength && farIndex !== -1) {
                    console.log(m + " is too long");
                    // atempt to add new line character after a comma
                    var i = m.lastIndexOf(",", farIndex);
                    farIndex = i;
                    m = m.slice(0, farIndex) + "\n" + m.slice(farIndex);
                    // update max width
                    var mSplit = m.split("\n");
                    mSplit.forEach(function (str) {
                        if (_this.ctx.measureText(str).width > c.width) {
                            c.width = _this.ctx.measureText(str).width;
                        }
                    });
                    console.log(m);
                    //   if (farIndex === 0) {
                    //     break;
                    //   }
                }
                if (mSize.width > c.width) {
                    c.width = mSize.width;
                    c.height += Draw.textSize;
                }
                return m;
            });
        }
        // padding
        c.width += 10;
        c.height += 10;
    };
    // maybe have a position, top left offeset - similar to matrix translation
    Draw.prototype.drawClass = function (x, y, c) {
        var _this = this;
        // DRAW MAIN CLASS
        this.drawClassName(x, y, c);
        if (c.properties) {
            this.drawClassProperties(x, y + c.height, c);
        }
        if (c.methods) {
            this.drawClassMethods(x, y + c.height, c);
        }
        if (c.children) {
            this.drawArrow({
                x: x + c.width / 2,
                y: c.height
            });
        }
        if (c.parent !== undefined) {
            this.drawLine({
                x: x + c.width / 2,
                y: y
            });
        }
        var originalX = x;
        // DRAW CHILDREN
        if (c.children) {
            c.children.forEach(function (ci, index) {
                var childX = x;
                if (index > 0) {
                    childX += _this.classes[index - 1].width + Draw.minClassHorizontalPadding;
                }
                // const childX = x + c.width - this.classes[ci].width;
                var childY = y + c.height + 20;
                // use the previous child width
                _this.drawClass(childX, childY, _this.classes[ci]);
            });
        }
    };
    Draw.prototype.drawArrow = function (point) {
        var arrowHeight = 20;
        var arrowWidth = 20;
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.x + arrowWidth / 2, point.y + arrowHeight);
        this.ctx.lineTo(point.x - arrowWidth / 2, point.y + arrowHeight);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();
        this.ctx.closePath();
    };
    Draw.prototype.drawLine = function (start, end) {
        // no end just little line
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        if (!end) {
            this.ctx.lineTo(start.x, start.y - 5);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    };
    Draw.textSize = 14;
    Draw.maxLineLength = 100;
    Draw.nameHeight = 20;
    Draw.minClassHorizontalPadding = 20;
    Draw.textHorizontalPadding = 5;
    return Draw;
}());
exports.Draw = Draw;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Class_1 = require("./Class");
var draw_1 = require("./draw");
var UMLInputString;
// maybe change to const
var classes = [];
var draw;
function getInputAndDraw() {
    UMLInputString = document.getElementById("UML-input")
        .value;
    // wipe without destroying reference
    classes.length = 0;
    UMLInputString = document.getElementById("UML-input")
        .value;
    console.log(UMLInputString);
    read();
    draw = new draw_1.Draw(document.getElementById("canvas"), 1200, 400);
    draw.draw(classes);
}
function setup() {
    document.getElementById("draw").onclick = function (e) {
        getInputAndDraw();
    };
}
function inClasses(name) {
    if (name === undefined) {
        return -1;
    }
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].name === name) {
            return i;
        }
    }
    return -1;
}
function read() {
    console.log("reading");
    var lines = UMLInputString.split("\n");
    // iterate over all lines in input
    for (var i = 0; i < lines.length; i++) {
        // tokenize each line
        var tokens = lines[i].split(" ");
        // if line begins with "class"
        if (tokens[0] === "class") {
            // get index of parent
            var parentIndex = inClasses(tokens[3]);
            if (parentIndex !== -1) {
                // initialise
                if (!classes[parentIndex].children) {
                    classes[parentIndex].children = [];
                }
                // to be created class
                classes[parentIndex].children.push(classes.length);
            }
            // is a child but parent doesnt exist
            if (tokens[3] && parentIndex === -1) {
                // create the parent
                classes.push(new Class_1.Class(tokens[3]));
                // keep track of the index
                parentIndex = classes.length - 1;
                // add this current class as a child of the parent
                classes[parentIndex].children = [];
                classes[parentIndex].children.push(classes.length);
            }
            // check if class already exists
            var alreadyExists = inClasses(tokens[1]) !== -1;
            var index = alreadyExists ? inClasses(tokens[1]) : null;
            var c = new Class_1.Class(tokens[1]);
            // get the properties and methods
            for (var j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith("class")) {
                    break;
                }
                // methods
                if (lines[j].includes("(")) {
                    // initialise arrays
                    if (alreadyExists && !classes[index].methods) {
                        classes[index].methods = [];
                    }
                    else {
                        if (!c.methods) {
                            c.methods = [];
                        }
                    }
                    // add to existing otherwise add to the current class
                    if (alreadyExists) {
                        classes[index].methods.push(lines[j]);
                    }
                    else {
                        c.methods.push(lines[j]);
                    }
                    // properties
                }
                else if (lines[j].includes(":")) {
                    // initialise arrays
                    if (alreadyExists && !classes[index].properties) {
                        classes[index].properties = [];
                    }
                    else {
                        if (!c.properties) {
                            c.properties = [];
                        }
                    }
                    // add to existing oetherwise add to the current class
                    if (alreadyExists) {
                        classes[index].properties.push(lines[j]);
                    }
                    else {
                        c.properties.push(lines[j]);
                    }
                }
            }
            // add to array if not already existing
            if (!alreadyExists) {
                if (parentIndex !== -1) {
                    c.parent = parentIndex;
                }
                classes.push(c);
            }
        }
    }
    console.log(classes);
}
setup();
getInputAndDraw();

},{"./Class":1,"./draw":2}]},{},[1,2,3]);
