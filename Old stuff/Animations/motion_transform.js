let signalX = [];
let signalY = [];
let fourierSignalX;
let fourierSignalY;
let sinEpoch=0
let cosEpoch=0
let time = 0;
let path = [];
let angle = 0;
let cosX = 800;
let cosY = 150;
let sinX = 400;
let sinY = 450;
let centreFlag = 0;

function epicycles (x,  y, rotation, fourierTransform) {
    
    for (let i = 0; i < fourierTransform.length; i++) {
        let prevx = x;
        let prevy = y;

        let freq = fourierTransform[i].freq;
        let radius = 1.5*fourierTransform[i].amp;         // scaled for nice appearance
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

function drawGrid(){      
    push();
    translate(0,0);
    stroke('#262626');
    strokeWeight(1);			
    for(i=0;i<=windowWidth;i+=10)
        line(i,0,i,windowHeight);
    for(i=0;i<=windowHeight;i+=10)
        line(0,i,windowWidth,i);
    pop();
}

function setup() {
    let cnv = createCanvas(windowWidth,windowHeight)
    cnv.parent('canvas')

    // initial dft calculation
    cosEpoch = document.getElementById('cos-epoch').value
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
    document.getElementById('sin-epoch').onmouseup = e => {
        sinEpoch = document.getElementById('sin-epoch').value
        for (let i = 0; i < 100; i++) {
            angle = map(i, 0, 100, 0, TWO_PI);
            signalY[i] = 75*sin(angle - sinEpoch);  // adding(+) sinEpoch causes code to break
        }
        fourierSignalY = dft(signalY); 
        path = [];

    } 

    document.getElementById('cos-epoch').onmouseup = e => {
        cosEpoch = document.getElementById('cos-epoch').value
        for (let i = 0; i < 100; i++) {
            angle = map(i, 0, 100, 0, TWO_PI);
            signalX[i] = 75*cos(angle - cosEpoch);
        }
        fourierSignalX = dft(signalX);
        path = [];

    } 

    document.getElementById('centralize').onclick = e => {
        if(centreFlag==0){
            cosY = windowHeight/2;
            sinX = windowWidth/2;
            sinY = windowHeight/2;
            cosX = windowWidth/2;
            centreFlag=1;
        }
        else{
            cosY = 150;
            sinX = 400;
            sinY = 450
            cosX = 800;
            centreFlag=0;

        }
        path = [];
    }
}

function draw() {
    background(75);
    drawGrid();
    let vx = epicycles (cosX, cosY, 0, fourierSignalX);       // if you match the origins, 
    let vy = epicycles (sinX, sinY, HALF_PI, fourierSignalY); //you get a single epicycle set
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