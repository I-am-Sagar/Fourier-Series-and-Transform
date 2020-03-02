let state = 0;
let time = 0;
let wave = [];
let sliderVal = 1;
let radius;
var checkboxVal;

function preload() {
    checkboxVal = document.getElementById('toggle');
    checkboxVal.checked = true;
}

function setup() {
    let myCanvas = createCanvas(900, 460);
    myCanvas.style('display', 'block');
    myCanvas.parent('canvas-1');

    document.getElementById('squareWave').onclick = e => {
        state = 1;
    }
    document.getElementById('sawtoothWave').onclick = e => {
        state = 2;
    }
    document.getElementById('slider').onchange = e => {
        sliderVal = document.getElementById('slider').value;
    }
    document.getElementById('toggle').onclick = e => {
        checkboxVal = document.getElementById('toggle');
        // if (checkboxVal.checked === true) {
        //     console.log("ON");
        // } else {
        //     console.log("OFF");
        // }
    }
}

function draw() {
    background(0); translate(180, 230); stroke(255, 150);
    line (250, 0, 650, 0);      
    line (300, -180, 300, 180);   
    line (-170, 0, 170, 0);     
    line (0, -170, 0, 170);  

    if (state == 1) {
        squareWave();
    } else if (state == 2) {
        sawtoothWave();
    }
}

function keyPressed() {
    if (key == 'q' || key == 'Q') {
        time = 0; wave = []; state = 0;
    }
}

function squareWave() {
    var x_pos = 0, x_neg = 0, y = 0;

    for (let i = 0; i < sliderVal; i++) {
        // value of n comes from fourier formula
        var prevx = x_pos, prevy = y, n = 2*i+1; 

        if (checkboxVal.checked === true) {
            radius = 100*(2/(n*PI));
        } else {
            radius = 200*(2/(n*PI));
        }

        x_pos += radius*cos(n*time);
        x_neg = -x_pos;
        y += radius*sin(n*time);

        stroke(10, 82, 117, 150); strokeWeight(2); noFill();
        ellipse (prevx, prevy, radius*2);

        if (checkboxVal.checked === true) {
            ellipse (x_pos, y, radius*2);
        }

        stroke(255, 50); strokeWeight(1);
        line(prevx, prevy, x_pos, y);

        if (checkboxVal.checked === true) {
            line(x_pos, y, 0, 2*y);
        }
    
        fill(10, 82, 117); stroke(10, 82, 117, 150);
        ellipse(x_pos, y, 6);
    }

    fill(255); 
    if (checkboxVal.checked === true) {
        ellipse(0, 2*y, 6);      
        ellipse(300, 2*y, 6); 
        wave.unshift(2*y);
    } else {
        ellipse(x_pos, y, 6);      
        ellipse(300, y, 6); 
        wave.unshift(y);
    }

    translate(300, 0);
    beginShape();
    noFill(); stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.03;

    if (wave.length > 325){
        wave.pop();
    }
}

function sawtoothWave() {
    var x_pos = 0, x_neg = 0, y = 0;

    for (let i = 0; i < sliderVal; i++) {
        var prevx = x_pos, prevy = y, n = i+1;

        if (checkboxVal.checked === true) {
            radius = 60*(2/(n*PI));
        } else {
            radius = 120*(2/(n*PI));
        }

        x_pos += radius*cos(n*time);
        x_neg = -x_pos;
        y += radius*sin(n*time);

        stroke(10, 82, 117, 150); strokeWeight(2); noFill();
        ellipse (prevx, prevy, radius*2);

        if (checkboxVal.checked === true) {
            ellipse (x_pos, y, radius*2);
        }

        stroke(255, 50); strokeWeight(1);
        line(prevx, prevy, x_pos, y);

        if (checkboxVal.checked === true) {
            line(x_pos, y, 0, 2*y);
        }
    
        fill(10, 82, 117); stroke(10, 82, 117, 150);
        ellipse(x_pos, y, 6);
    }

    fill(255); 
    if (checkboxVal.checked === true) {
        ellipse(0, 2*y, 6);      
        ellipse(300, 2*y, 6); 
        wave.unshift(2*y);
    } else {
        ellipse(x_pos, y, 6);      
        ellipse(300, y, 6); 
        wave.unshift(y);
    }

    translate(300, 0);
    beginShape();
    noFill(); stroke(255);
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();

    time += 0.05;

    if (wave.length > 325){
        wave.pop();
    }
}
