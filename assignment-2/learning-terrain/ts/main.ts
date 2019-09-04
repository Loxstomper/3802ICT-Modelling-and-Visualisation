interface IPoint {
    x: number,
    y: number,
    z?: number
};


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const width: number = 800;
const height: number = 800;
const resRatio: number = 160;

const PROJECTION_CENTER_X: number = width / 2;
const PROJECTION_CENTER_Y: number = height / 2;
const PERSPECTIVE: number = width * 0.8;

canvas.width = width;
canvas.height = height;

const heightMap: number[][] = [];

for(let y: number = 0; y < width / resRatio; y ++) {
    heightMap[y] = [];
    for (let x: number = 0; x < height / resRatio; x ++) {
        heightMap[y][x] = Math.random() * 100;
    }
}

const verticies: IPoint[][] = [];

for(let y: number = 0; y < width / resRatio; y ++) {
    verticies[y] = [];
    for (let x: number = 0; x < height / resRatio; x ++) {
        verticies[y][x] = {x: x * resRatio, y: y * resRatio, z: heightMap[x][y]};
    }
}

console.log(verticies);

function calcPointPerspective(point: IPoint): IPoint {
    let scaleProjected = PERSPECTIVE / (PERSPECTIVE + point.z);
    // let xProjected = (point.x * scaleProjected) + PROJECTION_CENTER_X;
    // let yProjected = (point.y * scaleProjected) + PROJECTION_CENTER_Y;
    // let xProjected = (point.x * scaleProjected);
    // let yProjected = (point.y * scaleProjected);

    let xProjected = point.x  * 10 / (10 - point.z) + point.x;
    let yProjected = point.y  * 10 / (10 - point.z) + point.y;

    return {x: xProjected, y: yProjected};
}

const cube = [
    {x: 100, y: 100, z: 0},
    {x: 200, y: 100, z: 0},
    {x: 200, y: 200, z: 0},
    {x: 100, y: 200, z: 0},

    {x: 100, y: 200, z: 100},
    {x: 100, y: 100, z: 100},
    {x: 200, y: 100, z: 100},
    {x: 200, y: 200, z: 100},


]

const cubePerspective = cube.map((p: IPoint) => calcPointPerspective(p));

console.log(cubePerspective);

function draw(verticies: IPoint[]) : void {
    ctx.beginPath();
    ctx.moveTo(verticies[0].x, verticies[0].y);

    for (let i: number = 0; i < verticies.length; i ++) {
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

