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

    let x = 0, y = 0;
    stroke(255, 150);
    line (x+200, -120, x+200, 120)

    for (let i = 0; i < slider.value(); i++) {
        let prevx = x;
        let prevy = y;

        let n = 2*i+1;
        let radius = 75*(4/(n*PI));
        x += radius*cos(n*time);
        y += radius*sin(n*time);

        stroke(255, 100);
        noFill();
        ellipse (prevx, prevy, radius*2);

        stroke(255);
        line(prevx, prevy, x, y);

        //fill(255);
        
    }
    ellipse(200, y, 5)
    wave.unshift(y);
    translate(200, 0);
    stroke(255, 100)
    line(x-200, y, 0, wave[0]);
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