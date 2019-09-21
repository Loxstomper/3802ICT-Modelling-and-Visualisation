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

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Class_1 = require("./Class");
var UMLInputString = "\nclass Banana extends Apple\n-bend: double \n+peel(): void\n\nclass Date extends Eggfruit\n\nclass Apple\n-seeds: int\n\nclass Cherry extends Apple\n\nclass Eggfruit\n\nclass Fig\n\nclass Grape extends Fig\n\nclass Honeydew extends Fig\n+wash(solvent: Solvent, howManyTimes: int, solventTemperature: double, scrubIntensity: double): void\n+dry(): void\n\nclass Imbe extends Fig\n\nclass Jackfruit extends Honeydew\n+slice(slices: int): void\n\nclass Kiwifruit extends Cherry\n";
// maybe change to const
var classes = [];
function setup() {
    document.getElementById("draw").onclick = function (e) {
        UMLInputString = document.getElementById("UML-input").value;
        console.log(UMLInputString);
    };
    read();
}
function inClasses(name) {
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].name === name) {
            return i;
        }
    }
    return -1;
}
function read() {
    console.log('reading');
    var lines = UMLInputString.split('\n');
    var currentClass;
    for (var i = 0; i < lines.length; i++) {
        var tokens = lines[i].split(' ');
        if (tokens[0] === "class") {
            // let cLocation = inClasses(tokens[0]);
            // if (cLocation !== -1) {
            // }
            var c = tokens.length === 4 ? new Class_1.Class(tokens[1], tokens[3]) : new Class_1.Class(tokens[1]);
            for (var j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('class') || lines[j].startsWith(' ')) {
                    // if (lines[j].startsWith('class')) {
                    break;
                }
                // console.log(lines[j]);
                // console.log(lines[j]);
                if (lines[j].includes('(')) {
                    if (!c.methods) {
                        c.methods = [];
                    }
                    c.methods.push(lines[j]);
                }
                else {
                    if (!c.properties) {
                        c.properties = [];
                    }
                    // c.properties.push(lines[i + 1]);
                    c.properties.push(lines[j]);
                }
            }
            // console.log(c);
            // return;
            // console.log(c);
            classes.push(c);
            // console.log(c);
            // console.log(tokens[1]);
        }
    }
    console.log(classes);
}
setup();
var x = new Class_1.Class("Banana", "Apple");

},{"./Class":1}]},{},[1,2,3]);
