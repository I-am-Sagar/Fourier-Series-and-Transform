let signalX = [];
let signalY = [];
let fourierSignalX;
let fourierSignalY;

let time = 0;
let path = [];
let angle = 0;

function setup() {
    createCanvas(600, 400);

    for (let i = 0; i < 100; i++) {
        angle = map(i, 0, 100, 0, TWO_PI);
        signalX[i] = 75*cos(angle);
    }

    for (let i = 0; i < 100; i++) {
        angle = map(i, 0, 100, 0, TWO_PI);
        signalY[i] = 75*sin(angle);
    }

    fourierSignalX = dft(signalX);
    fourierSignalY = dft(signalY);
}

function epicycles (x,  y, rotation, fourierTransform) {
    for (let i = 0; i < fourierTransform.length; i++) {
        let prevx = x;
        let prevy = y;

        let freq = fourierTransform[i].freq;
        let radius = fourierTransform[i].amp;
        let phase = fourierTransform[i].phase;
        x += radius*cos(freq*time + phase + rotation);
        y += radius*sin(freq*time + phase + rotation);

        stroke(255, 100);
        noFill();
        ellipse (prevx, prevy, radius*2);
        stroke(255);
        line(prevx, prevy, x, y);
    }
    return createVector(x, y);
}

function draw() {
    background(0);

    let vx = epicycles (400, 50, 0, fourierSignalX);
    let vy = epicycles (100, 250, HALF_PI, fourierSignalY);
    let v = createVector(vx.x, vy.y);
    path.unshift(v);
    
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierSignalY.length;
    time += dt;

    if (path.length > 250){
        path.pop();
    }
}   