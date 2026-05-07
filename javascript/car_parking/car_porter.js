// Uses documentation from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var isDown = 0;

var x = 300;
var y = 530;

var dx = 0;
var dy = 0;

var level = 1;
var speed = 1;
var parked = 0;

var angle = 0;
var speedMod = 0;

// Display an image
function rendImage(nx, ny, xlen, ylen, imSource) {
    // loading image from HTML element for this level
    let img = document.getElementById(imSource);
    ctx.drawImage(img, nx, ny, xlen, ylen);
}

// Rotate an image
function rotaImg(nx, ny, xlen, ylen, imSource, degs) {
    ctx.save();
    // find the center of the image
    let transx = nx + (xlen * 0.5);
    let transy = ny + (ylen * 0.5);
    // translate to center of image
    ctx.translate(transx, transy);
    // rotate the image
    ctx.rotate(4 * degs * (Math.PI / 180));
    // go back to normal canvase
    ctx.translate(-transx, -transy);
    // draw the image on the screen
    rendImage(nx, ny, xlen, ylen, imSource);
    ctx.restore();
}

function drawField() {
    ctx.beginPath();
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 40, 10, 410);
    ctx.fillRect(10, 140, 160, 10);
    ctx.fillRect(10, 240, 160, 10);
    ctx.fillRect(10, 340, 160, 10);
    ctx.fillRect(10, 440, 160, 10);

    ctx.fillRect(canvas.width, 40, -10, 410);
    ctx.fillRect(canvas.width - 10, 140, -160, 10);
    ctx.fillRect(canvas.width - 10, 240, -160, 10);
    ctx.fillRect(canvas.width - 10, 340, -160, 10);
    ctx.fillRect(canvas.width - 10, 440, -160, 10);

    ctx.fillRect(0, 40, canvas.width, 10);
    
    ctx.stroke();
}

// check to see if sprite is off canvas screen
function outBounds() {
    if (x + 60 >= canvas.width + 10 || x <= 10 || y + 30 >= canvas.height || y - 15 <= 40) {
        cancelAnimationFrame();
    }
}


const mouse = {
    x: 0,
    y: 0
};
var angle = 0;

function mouseEvents(e) {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - scrollX;
    mouse.y = e.pageY - bounds.top - scrollY;
}
document.addEventListener("mousemove", mouseEvents);


function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawField();

    angle = (mouse.x - 480) / 10;
    if (angle > 0) {
        angle = 0;
    } else if (angle < -45) {
        angle = -45;
    }
    speedMod = 22.5 - Math.abs(angle);

    // draw a .bmp image file on the screen
    rotaImg(x, y, 60, 30, "car_01", angle);
    outBounds();
    dx = (speed + level) * speedMod / 22.5;
    dy = Math.abs(dx) - (speed + level);
    x += dx;
    y += dy;

    document.getElementById("status_box1").innerHTML = "x: " + x + "   y: " + y;
    document.getElementById("status_box2").innerHTML = "Angle: " + angle + "  dx: " + dx + "  dy: " + dy;
    document.getElementById("status_box3").innerHTML = "speed: " + speed + "  speedMod:  " + speedMod;

    requestAnimationFrame(draw);
}

draw();