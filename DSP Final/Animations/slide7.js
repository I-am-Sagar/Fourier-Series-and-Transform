var show_sound;
var show_reverb;
var sound;
var reverb;
var volume;
var spectrum;
let fft;

var path_sound = "../Assets/sound/MariagedAmour.mka";
var path_reverb = "../Assets/reverb/concrete-tunnel.mp3";

function preload(){
    show_sound = loadSound(path_sound);
    show_reverb = loadSound(path_reverb);
    sound = loadSound(path_sound);
    reverb = createConvolver(path_reverb);
}

function setup() {
    let myCanvas = createCanvas(900, 480);
    myCanvas.style('display', 'block');
    myCanvas.parent('canvas-1');
    
    fft = new p5.FFT(); 

    document.getElementById('btn_sound').onclick = e => {
        // console.log('btn_sound');
        show_sound.loop();
        show_reverb.stop();
        sound.stop();
    }

    document.getElementById('btn_reverb').onclick = e => {
        // console.log('btn_reverb');
        show_sound.stop();
        show_reverb.loop();
        sound.stop();
    }

    document.getElementById('btn_effect').onclick = e => {
        // console.log('btn_effect');
        show_sound.stop();
        show_reverb.stop();
        sound.disconnect();
        reverb.process(sound);
        sound.loop();
    }
}

function draw() {
    // console.log(document.getElementById('btn_sound').value);
    background(0);
    colorMode(HSB);
    spectrum = fft.analyze();
    noStroke(); strokeWeight(1);
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width*2);
      let h = -height + map(spectrum[i], 100, 255, height, 10) + 30;
      fill(map(i,0,spectrum.length,0,255),255,255);
      rect(x, height/1.1, width*3 / spectrum.length - 1, h)
    }
}   

function keyPressed () {
    if (key == 'q' || key == 'Q') {
        show_sound.stop();
        show_reverb.stop();
        sound.stop();
    }
}