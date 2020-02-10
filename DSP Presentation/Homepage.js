// NOTE: This sketch doesn't require fourier.js

let signal;
let N = 2500;
// This is signal's length i.e. Number of input samples.
// From SVG file, we will take only 'N' values. Increase N, for better path 
// quality. But 2000 is enough. Increasing it further, increases render time.

let fourierSignal;
let M = 300; 
// This is the number of circles i.e. Length of Fourier Signal.

let q = 100000; 
// This is the total number of samples in output i.e. points on the final 
// svg drawing, made by fourier transforms.

let path = [];
let time = 0;
let freq_array;     // Used while computing DFT

let zoom;   // For zoom slider
let speed = 50;  // For speed slider

var viewbox = {width: 1080};  // Used further while collecting signal from svg 
var setupDone = false;  // Variable to check if setup() has completed or not
var follow = false;  // Variable to set whether to follow drawing vertex or not
var width = 1080;   // Width used as reference for zoom slider's values

// Some basic Complex functions
function aabs([re, im]) {   
    return sqrt(re*re + im*im);
}

function exp_im(im) {
    return [cos(im), sin(im)];
}

function add([rea, ima], [reb, imb]) {
    return [rea + reb, ima + imb];
}

function mul([rea, ima], [reb, imb]) {
    return [rea * reb - ima * imb, rea * imb + ima * reb];
}

async function setup() {
    createCanvas(1080, 720);
    zoom = createSlider(5,50,10);
    //speed = createSlider(1,50,1);

    // Getting SVG file
    let svg = await fetch("./Assets/Fourier_sketch.svg")
        .then(response => response.text())
        .then(text => (new DOMParser).parseFromString(text, "image/svg+xml"))
        .then(svg => svg.documentElement);
    viewbox = svg.viewBox.baseVal;

    // Get the SVG file's path. From that, get 'N' input samples, uniformly
    // spaced - so that the path is not distorted.
    let svg_path = svg.querySelector("path");
    const svg_path_length = svg_path.getTotalLength();
    signal = Array.from({length: N}, (_, i) => {
        const {x, y} = svg_path.getPointAtLength(i / N * svg_path_length);
        return [x - viewbox.width / 2, y - viewbox.height / 2];
    });
    
    // Calculate DFT of signal here only
    freq_array = Int16Array.from({length: M}, (_, i) => (1 + i >> 1) * (i & 1 ? -1 : 1));
    fourierSignal = Array.from(freq_array, k => {
        let sum = [0, 0];
        for (let i = 0, N = signal.length; i < N; ++i) {
            sum = add(sum, mul(signal[i], exp_im(k * i / N * 2 * -PI)));
        }
        return [sum[0] / N, sum[1] / N];
    });
    //console.log(fourierSignal);
    setupDone = true;
}

function draw() {
    background(0);

    if(setupDone) { 
        // Zooming
        const scale_value = zoom.value()/10 * width / viewbox.width;
        translate(width / 2, height / 2);
        scale(scale_value);

        // Calculate the current point.
        const a = time * 2 / q * PI;
        let p = [0, 0];
        for (let i = 0; i < M; ++i) {
            p = add(p, mul(fourierSignal[i], exp_im(a * freq_array[i])));
        }

        // Following the tip
        if(follow) {
            translate(-p[0], -p[1]);
        }
        
        // Draw circles.
        noFill(); stroke(255, 100);
        for (let i = 0, p = [0, 0]; i < M; ++i) {
            const r = aabs(fourierSignal[i]);
            ellipse(p[0], p[1],r*2);
            p = add(p, mul(fourierSignal[i], exp_im(a * freq_array[i])));
        }

        // Draw lines.
        stroke(125);
        for (let i = 0, p = [0, 0]; i < M; ++i) {
            prevP = p;
            p = add(p, mul(fourierSignal[i], exp_im(a * freq_array[i])));
            line(...prevP, ...p);
        }

        // Draw the path.
        beginShape();
        noFill();
        stroke(255);
        strokeWeight(2); // strokeweight = 0.05 for Batman Logo
        if (path.length < q) path.push(p);
        for (let i = 1, n = path.length; i < n; ++i) {
            vertex(...path[i]);
        }
        endShape();

        time += speed;
    }
}

function keyPressed() {
    if (key == "q" || key == "Q") {
        follow = !follow;
    }
}