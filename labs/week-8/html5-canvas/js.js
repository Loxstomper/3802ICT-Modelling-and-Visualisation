
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


ctx.save()

ctx.rotate(Math.PI / 4);
ctx.font = "30px Arial";
ctx.fillText("Some Text", 100, 100);

ctx.restore();

ctx.fillStyle = "green";
ctx.fillRect(200, 200, 100, 50);

