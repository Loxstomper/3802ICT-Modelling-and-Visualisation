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
var horizontalPadding = 10;
var verticalPadding = 10;
var Draw = /** @class */ (function () {
    function Draw(canvas, width, height) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
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
                    // change this to bounding box method
                    var parentWidth = c.width + Draw.minClassHorizontalPadding;
                    var sumChildrenWidth_1 = 0;
                    if (c.children) {
                        c.children.forEach(function (child) {
                            sumChildrenWidth_1 +=
                                _this.classes[child].width + Draw.minClassHorizontalPadding;
                        });
                    }
                    x =
                        parentWidth > sumChildrenWidth_1
                            ? x + parentWidth
                            : x + sumChildrenWidth_1;
                    // x += 200;
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
        this.ctx.rect(x, y, c.width + 5, Draw.textSize + 10);
        c.height = y + Draw.textSize + 10;
        this.ctx.stroke();
        this.ctx.fillText(c.name, x + c.width / 2 - size.width / 2 + 2.5, y + 15);
    };
    Draw.prototype.drawClassProperties = function (x, y, c) {
        var _this = this;
        this.ctx.font = Draw.textSize + "px arial";
        var originalY = y;
        c.properties.forEach(function (p, index) {
            _this.ctx.fillText(p, x + Draw.textHorizontalPadding, 
            // y + index * Draw.textSize + 5
            c.height + index * Draw.textSize + 10
            // y
            );
            y += Draw.textSize;
        });
        this.ctx.beginPath();
        this.ctx.rect(x, c.height, c.width + Draw.textHorizontalPadding, y - originalY);
        // c.height = y - originalY;
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
        var originalY = y;
        y += 15;
        c.methods.forEach(function (m, i) {
            // draw normally if no new line characters
            if (m.indexOf("\n") === -1) {
                // this.ctx.fillText(m, x + 5, y + 5);
                _this.ctx.fillText(m, x + 5, y + i * 5);
            }
            else {
                // split on new line character
                var lines = m.split("\n");
                // draw each line
                lines.forEach(function (l, index) {
                    // dont indent
                    if (index === 0) {
                        _this.ctx.fillText("" + l, x + 5, y + 5);
                        // this.ctx.fillText(`${l}`, x + 5, y + 5);
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
        this.ctx.rect(x, c.height, c.width + Draw.textHorizontalPadding, y - originalY);
        this.ctx.stroke();
        c.height = y;
    };
    Draw.prototype.wrapText = function (c) {
        var _this = this;
        this.ctx.font = "bold " + Draw.textSize + "px arial";
        var nameSize = this.ctx.measureText(c.name);
        // to start with make the width of the box equal to the name
        c.width = nameSize.width;
        // height of name + padding
        c.height = Draw.textSize + 10;
        // change font to the normal font
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
            // reset the width
            c.width = 0;
            // split strings if too long
            c.methods.forEach(function (str, index) {
                // original length
                var originalLength = _this.ctx.measureText(str).width;
                if (originalLength > Draw.maxLineLength) {
                    // just testing by splitting on the ','
                    c.methods[index] = str.split(",").join(",\n");
                }
            });
            // set to largest string width
            c.methods.forEach(function (str) {
                str.split("\n").forEach(function (strs) {
                    if (_this.ctx.measureText(strs).width > c.width) {
                        c.width = _this.ctx.measureText(strs).width;
                    }
                });
            });
        }
        // padding
        c.width += 15;
        c.height += 10;
    };
    // maybe have a position, top left offeset - similar to matrix translation
    Draw.prototype.drawClass = function (x, y, c) {
        var _this = this;
        c.x = x;
        c.y = y;
        // draw classname
        this.drawClassName(x, y, c);
        // draw properties
        if (c.properties) {
            this.drawClassProperties(x, c.height, c);
        }
        // draw methods
        if (c.methods) {
            this.drawClassMethods(x, c.height, c);
        }
        // draw arrow head if there are children
        if (c.children) {
            this.drawArrow({
                x: x + c.width / 2,
                y: c.height
            });
        }
        // if there is a parent draw a line to it
        if (c.parent !== undefined) {
            this.drawLine({
                x: x + c.width / 2,
                y: y
            }, {
                x: this.classes[c.parent].x + this.classes[c.parent].width / 2,
                // y: this.classes[c.parent].y + this.classes[c.parent].height
                y: this.classes[c.parent].height + 10
            });
        }
        // draw the children
        if (c.children) {
            // iterate over each child
            c.children.forEach(function (ci, index) {
                var childX;
                // first child always directly below parent
                if (index === 0) {
                    childX = c.x + c.width / 2 - _this.classes[ci].width / 2;
                }
                else {
                    // use the previous drawn child for x location
                    childX =
                        _this.classes[c.children[index - 1]].x +
                            _this.classes[c.children[index - 1]].width +
                            Draw.minClassHorizontalPadding;
                }
                // calculating the y position
                var childY = c.y + c.height + 20;
                childY = c.height + 40;
                // draw the child
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
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        // up 5, accross, up
        this.ctx.lineTo(start.x, start.y - 5);
        this.ctx.lineTo(end.x, start.y - 5);
        this.ctx.lineTo(end.x, end.y + 10);
        this.ctx.stroke();
        this.ctx.closePath();
    };
    Draw.textSize = 14;
    Draw.maxLineLength = 400;
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
