var show_sound;
var show_reverb;
var sound;
var reverb;

var volume;

var spectrum;

let fft;

var path_sound = "Assets/sound/song.mp3";
var path_reverb = "Assets/reverb/concrete-tunnel.mp3";

function preload(){
    show_sound = loadSound(path_sound);
    show_reverb = loadSound(path_reverb);
    sound = loadSound(path_sound);
    reverb = createConvolver(path_reverb);

}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    

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
    background('rgb(75,75,75)');
    colorMode(HSB);
    spectrum = fft.analyze();

    translate(100,0);
    noStroke();
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0,width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      fill(map(i,0,spectrum.length,0,255),255,255);
      rect(x, height, width / spectrum.length - 1, h )
    }

    

}   