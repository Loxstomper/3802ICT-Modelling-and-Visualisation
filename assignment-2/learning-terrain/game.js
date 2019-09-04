(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 800;
var height = 800;
var resRatio = 160;
var PROJECTION_CENTER_X = width / 2;
var PROJECTION_CENTER_Y = height / 2;
var PERSPECTIVE = width * 0.8;
canvas.width = width;
canvas.height = height;
var heightMap = [];
for (var y = 0; y < width / resRatio; y++) {
    heightMap[y] = [];
    for (var x = 0; x < height / resRatio; x++) {
        heightMap[y][x] = Math.random() * 100;
    }
}
var verticies = [];
for (var y = 0; y < width / resRatio; y++) {
    verticies[y] = [];
    for (var x = 0; x < height / resRatio; x++) {
        verticies[y][x] = { x: x * resRatio, y: y * resRatio, z: heightMap[x][y] };
    }
}
console.log(verticies);
function calcPointPerspective(point) {
    var scaleProjected = PERSPECTIVE / (PERSPECTIVE + point.z);
    // let xProjected = (point.x * scaleProjected) + PROJECTION_CENTER_X;
    // let yProjected = (point.y * scaleProjected) + PROJECTION_CENTER_Y;
    // let xProjected = (point.x * scaleProjected);
    // let yProjected = (point.y * scaleProjected);
    var xProjected = point.x * 10 / (10 - point.z) + point.x;
    var yProjected = point.y * 10 / (10 - point.z) + point.y;
    return { x: xProjected, y: yProjected };
}
var cube = [
    { x: 100, y: 100, z: 0 },
    { x: 200, y: 100, z: 0 },
    { x: 200, y: 200, z: 0 },
    { x: 100, y: 200, z: 0 },
    { x: 100, y: 200, z: 100 },
    { x: 100, y: 100, z: 100 },
    { x: 200, y: 100, z: 100 },
    { x: 200, y: 200, z: 100 },
];
var cubePerspective = cube.map(function (p) { return calcPointPerspective(p); });
console.log(cubePerspective);
function draw(verticies) {
    ctx.beginPath();
    ctx.moveTo(verticies[0].x, verticies[0].y);
    for (var i = 0; i < verticies.length; i++) {
        ctx.lineTo(verticies[i].x, verticies[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}
draw(cubePerspective);
// draw triangles
// for(let y: number = 0; y < (width / resRatio) - 1; y ++) {
//     for (let x: number = 0; x < (height / resRatio) - 1; x ++) {
//         const topLeft = calcPointPerspective(verticies[y][x]);
//         const topRight = calcPointPerspective(verticies[y][x + 1]);
//         const bottomRight = calcPointPerspective(verticies[y + 1][x + 1]);
//         const bottomLeft = calcPointPerspective(verticies[y + 1][x]);
//         ctx.beginPath();
//         ctx.moveTo(topLeft.x, topLeft.y);
//         ctx.lineTo(topRight.x, topRight.y);
//         ctx.lineTo(bottomRight.x, bottomRight.y);
//         ctx.closePath();
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(bottomRight.x, bottomRight.y);
//         ctx.lineTo(bottomLeft.x, bottomLeft.y);
//         ctx.lineTo(topLeft.x, topLeft.y);
//         ctx.closePath();
//         ctx.stroke();
//     }
// }

},{}]},{},[1]);
