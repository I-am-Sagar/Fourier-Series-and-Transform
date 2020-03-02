let time = 0;
let wave = [];
let slider;

function setup() {
    let cnv = createCanvas(700, 400);
    cnv.style('display', 'block');
    cnv.parent('canvas');
    slider = createSlider(1, 10, 1);
    slider.parent('control');
}

function windowResized() {
    resizeCanvas(720,480);
}

function draw() {
    background(0);
    translate(150, 200);

    let x = 0, xn = 0, y = 0;
    stroke(255, 150);
    line (x+200, -120, x+200, 120)

    for (let i = 0; i < slider.value(); i++) {
        let prevx = x;
        let prevy = y;

        let n = 2*i+1;
        let radius = 75*(2/(n*PI));
        x += radius*cos(n*time);
        xn = -x;
        y += radius*sin(n*time);

        stroke(255, 100);
        noFill();
        ellipse (prevx, prevy, radius*2);
        ellipse (x, y, radius*2);

        stroke(255);
        line(prevx, prevy, x, y);
        line(x, y, 0, 2*y);

        //fill(10, 82, 117); 
        stroke(255, 200);
        strokeWeight(1);
        ellipse(x, y, 6);       // Point on the circle 1

        //fill(255);
    }
    fill(255); 
    ellipse(0, 2*y, 6);      // Point on circle 2
    // ellipse(0, 2*y2, 6);    // Oscillating point on y axis of phasor diag
    ellipse(200, 2*y, 6);     // Oscillating point on y axis of sine wave

    wave.unshift(2*y);
    translate(200, 0);
    stroke(255, 100)
    //line(x-200, y, 0, wave[0]);
    beginShape();
    noFill();
    stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.03;

    if (wave.length > 300){
        wave.pop();
    }
}   