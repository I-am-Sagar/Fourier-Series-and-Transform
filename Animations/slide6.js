const USER = 0;
const FOURIER = 1;

let signal = [];
let fourierSignal;

let time = 0;
let path = [];
let drawing = [];
let state = -1;
let start = false;

function mousePressed() {
    state = USER;
    drawing = [];
    signal = []; 
    time = 0;
    path = [];
    start = true;
}

function mouseReleased() {
    state = FOURIER;

    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
        const c = new Complex (drawing[i].x, drawing[i].y);
        signal.push(c);
    }

    fourierSignal = dft(signal);

    fourierSignal.sort((a, b) => b.amp - a.amp);
}

function setup() {
    let myCanvas = createCanvas(1080, 580);
    myCanvas.style('display', 'block');
    myCanvas.parent('canvas-2');
}

function epicycles (x, y, rotation, fourierTransform) {
    for (let i = 0; i < fourierTransform.length; i++) {
        let prevx = x;
        let prevy = y;

        let freq = fourierTransform[i].freq;
        let radius = fourierTransform[i].amp;
        let phase = fourierTransform[i].phase;

        x += radius*cos(freq*time + phase + rotation);
        y += radius*sin(freq*time + phase + rotation);

        stroke(10, 82, 117, 150); strokeWeight(2);
        noFill();
        ellipse (prevx, prevy, radius*2);
        stroke(255, 100);
        line(prevx, prevy, x, y);
    }
    return createVector(x, y);
}

function draw() {
    background(0);
    stroke(10, 82, 117); strokeWeight(2);
    line(1, 1, width, 1);
    line(1, 1, 1, height);
    line(width, 1, width-2, height);
    line(1, height, width, height);
    if (start) {
        if (state == USER) {  
            
            let point = createVector(mouseX-width/2, mouseY-height/2);
            drawing.push(point);
    
            stroke(255); noFill();
            beginShape();
            for (let v of drawing) {
                vertex(v.x + width/2, v.y + height/2);
            }
            endShape();
    
        } else if (state == FOURIER) {
            let v = epicycles (width/2, height/2, 0, fourierSignal);
            path.unshift(v);
    
            beginShape();
            noFill(); stroke(255); strokeWeight(2);
            for (let i = 0; i < path.length; i++) {
                vertex(path[i].x, path[i].y);
            }
            endShape();
    
            const dt = TWO_PI / fourierSignal.length;
            time += dt;
    
            if (time > TWO_PI) {
                time = 0;
                path = [];
            }
        }
    }
}

function keyPressed() {
    if (key == 'q' || key == 'Q') {
        start = false;
    }
}