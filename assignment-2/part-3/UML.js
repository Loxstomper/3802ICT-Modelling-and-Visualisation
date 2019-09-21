(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
require("./Class");
var x = new Class("Banana", "Apple");
console.log(x);

},{"./Class":1}]},{},[1,2,3]);
