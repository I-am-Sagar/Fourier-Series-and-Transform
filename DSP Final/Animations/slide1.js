let time = 0;
let wave = [];
let state = 0;

function setup() {
    let myCanvas = createCanvas(900, 600);
    myCanvas.style('display', 'block');
    myCanvas.parent('canvas-1');
    document.getElementById('visual-1').onclick = e => {
        state = 1;
    }
    document.getElementById('visual-2').onclick = e => {
        state = 2;
    }
    document.getElementById('visual-3').onclick = e => {
        state = 3;
    }
}

function draw() {
    if (state == 0) {
        background(0);
    } else if (state == 1) {
        singlePhasor();
    } else if (state == 2) {
        doublePhasor1();
    } else if (state == 3) {
        doublePhasor2();
    }
}

function keyPressed() {
    if (key == 'q' || key == 'Q') {
        time = 0;
        wave = [];  
        state = 0;
    }
}

function singlePhasor() {
    background(0); translate(180, 300);

    var x = 0, y = 0;
    stroke(255, 150);
    line (250, 0, 650, 0);      // x axis for sine wave
    line (x+300, -180, x+300, 180);   //y axis for sine wave (Oscillating point)
    line (-170, 0, 170, 0);     // x axis for circle
    line (0, -170, 0, 170);     // y axis for circle

    var radius = 120*4/PI;
    x += radius*cos(time);
    y += radius*sin(time);
    stroke(10, 82, 117, 150);
    strokeWeight(3);
    noFill();
    ellipse(0, 0, radius*2);    // Circle of the phasor
    stroke(255, 150); strokeWeight(2);
    line(0, 0, x, y);       // Radius of the circle

    fill(255); strokeWeight(1);
    ellipse(x, y, 6)        // Point on the circle
    ellipse(300, y, 6);     // Oscillating point
    wave.unshift(y);
    
    translate(300, 0);
    stroke(255, 100)
    line(x-300, y, 0, wave[0]);  // Projection line
    beginShape();
    noFill();
    stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.03;

    if (wave.length > 325){
        wave.pop();
    }
}

function doublePhasor1() {
    background(0); translate(180, 300);

    var x_pos = 0, x_neg = 0, y2 = 0;
    stroke(255, 150);
    line (250, 0, 650, 0);      // x axis for sine wave
    line (x_pos+300, -180, x_pos+300, 180);   //y axis for sine wave (Oscillating point)
    line (-170, 0, 170, 0);     // x axis for circle
    line (0, -170, 0, 170);     // y axis for circle

    var radius = 60*4/PI;
    x_pos += radius*cos(time);
    x_neg = -x_pos;
    y2 += radius*sin(time);

    stroke(10, 82, 117, 150);
    strokeWeight(3);
    noFill();
    ellipse(0, 0, radius*2);    // Circle of the phasor

    stroke(255, 150); strokeWeight(2);
    line(0, 0, x_pos, y2);       // Radius of the circle 1
    line(0, 0, x_neg, y2);       // Radius of the circle 2

    fill(10, 82, 117); strokeWeight(1);
    ellipse(x_pos, y2, 6);       // Point on the circle 1
    ellipse(x_neg, y2, 6);      // Point on circle 2

    fill(255); 
    ellipse(0, 2*y2, 6);    // Oscillating point on y axis of phasor diag
    ellipse(300, 2*y2, 6);     // Oscillating point on y axis of sine wave

    wave.unshift(2*y2);

    translate(300, 0);
    beginShape();
    noFill();
    stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.03;

    if (wave.length > 325){
        wave.pop();
    }
}

function doublePhasor2() {
    background(0); translate(180, 300);

    var x_pos = 0, x_neg = 0, y2 = 0;
    stroke(255, 150);
    line (250, 0, 650, 0);      // x axis for sine wave
    line (x_pos+300, -180, x_pos+300, 180);   //y axis for sine wave (Oscillating point)
    line (-170, 0, 170, 0);     // x axis for circle
    line (0, -170, 0, 170);     // y axis for circle

    var radius = 60*4/PI;
    x_pos += radius*cos(time);
    x_neg = -x_pos;
    y2 += radius*sin(time);

    stroke(10, 82, 117, 150);
    strokeWeight(3);
    noFill();
    ellipse(0, 0, radius*2);    // Circle of the phasor 1
    ellipse(x_pos, y2, radius*2); // Circle of the phasor 2

    stroke(255, 150); strokeWeight(2);
    line(0, 0, x_pos, y2);       // Radius of the circle 1
    line(x_pos, y2, 0, 2*y2);       // Radius of the circle 2

    fill(10, 82, 117); strokeWeight(1);
    ellipse(x_pos, y2, 6);       // Point on the circle 1
    

    fill(255); 
    ellipse(0, 2*y2, 6);      // Point on circle 2
    // ellipse(0, 2*y2, 6);    // Oscillating point on y axis of phasor diag
    ellipse(300, 2*y2, 6);     // Oscillating point on y axis of sine wave

    wave.unshift(2*y2);

    translate(300, 0);
    beginShape();
    noFill();
    stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.03;

    if (wave.length > 325){
        wave.pop();
    }
}
