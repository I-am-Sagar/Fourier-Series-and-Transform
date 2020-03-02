let signalX = [];
let signalY = [];
let fourierSignalX;
let fourierSignalY;
let sinEpoch=0
let cosEpoch=0
let time = 0;
let path = [];
let angle = 0;
let cosY = 120;
let sinX = 300;
let sinY = 350
let cosX = 550;
let start = 0;

function setup() {
    let myCanvas = createCanvas(900, 500);
    myCanvas.style('display', 'block');
    myCanvas.parent('canvas-1');

    // Initial DFT calculation
    cosEpoch = document.getElementById('cosine-epoch').value;
    for (let i = 0; i < 100; i++) {
        angle = map(i, 0, 100, 0, TWO_PI);
        signalX[i] = 75*cos(angle - cosEpoch);
    }
    fourierSignalX = dft(signalX);

    for (let i = 0; i < 100; i++) {
        angle = map(i, 0, 100, 0, TWO_PI);
        signalY[i] = 75*sin(angle - sinEpoch);
    }
    fourierSignalY = dft(signalY);

    // user input based recalculation of dft
    document.getElementById('sine-epoch').onchange = e => {
        sinEpoch = document.getElementById('sine-epoch').value
        for (let i = 0; i < 100; i++) {
            angle = map(i, 0, 100, 0, TWO_PI);
            // adding(+) sinEpoch causes code to break
            signalY[i] = 75*sin(angle - sinEpoch); 
        }
        fourierSignalY = dft(signalY); 
        path = [];
    } 

    document.getElementById('cosine-epoch').onchange = e => {
        cosEpoch = document.getElementById('cosine-epoch').value
        for (let i = 0; i < 100; i++) {
            angle = map(i, 0, 100, 0, TWO_PI);
            signalX[i] = 75*cos(angle - cosEpoch);
        }
        fourierSignalX = dft(signalX);
        path = [];
    }

    document.getElementById('doubleEpicycle').onclick = e => {
        cosY = 120; sinX = 300;
        sinY = 350; cosX = 550;
        path = []; start = 1;
    }

    document.getElementById('singleEpicycle').onclick = e => {
        cosY = height/2; sinX = width/2;
        sinY = height/2; cosX = width/2;
        path = []; start = 1;
    }
}

function draw() {
    background(0);
    if (start == 1) {
        let vx = epicycles (cosX, cosY, 0, fourierSignalX);       // if you match the origins, 
        let vy = epicycles (sinX, sinY, HALF_PI, fourierSignalY); //you get a single epicycle set
        let v = createVector(vx.x, vy.y);
        path.unshift(v);
        
        line(vx.x, vx.y, v.x, v.y);
        line(vy.x, vy.y, v.x, v.y);

        beginShape();
        stroke(255, 150); strokeWeight(2); noFill();
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();
    
        const dt = TWO_PI / fourierSignalY.length;
        time += dt;
    
        if (path.length > 250) {
            path.pop();
        }
    }
}

function epicycles (x,  y, rotation, fourierTransform) {
    for (let i = 0; i < fourierTransform.length; i++) {
        let prevx = x;
        let prevy = y;

        let freq = fourierTransform[i].freq;
        let radius = 1.6*fourierTransform[i].amp;  // scaled for nice appearance
        let phase = fourierTransform[i].phase;
        x += radius*cos(freq*time + phase + rotation);
        y += radius*sin(freq*time + phase + rotation);

        stroke(10, 82, 117, 150); strokeWeight(2.5);
        noFill();
        ellipse (prevx, prevy, radius*2);
        stroke(255, 75); strokeWeight(1.5);
        line(prevx, prevy, x, y);
    }
    return createVector(x, y);
}

function keyPressed() {
    if (key == 'q' || key == 'Q') {
        start = 0;
    }
}